import { execFileSync } from 'node:child_process'

interface PatternCheck {
  label: string
  pattern: string
  risk: 'high' | 'info'
  description: string
}

const checks: PatternCheck[] = [
  {
    label: 'GitHub token',
    pattern: 'ghp_|github_pat_',
    risk: 'high',
    description: 'Tokens do GitHub nunca devem aparecer no histórico.',
  },
  {
    label: 'OpenAI secret',
    pattern: 'sk-live-|sk-proj-',
    risk: 'high',
    description: 'Chaves secretas de API públicas comprometem a conta.',
  },
  {
    label: 'AWS access key',
    pattern: 'AKIA[0-9A-Z]{16}',
    risk: 'high',
    description: 'Credenciais AWS públicas precisam ser rotacionadas imediatamente.',
  },
  {
    label: 'Google API key',
    pattern: 'AIza[0-9A-Za-z_-]{35}',
    risk: 'high',
    description: 'Chaves do ecossistema Google não devem estar em commits.',
  },
  {
    label: 'Private key PEM',
    pattern: '-----BEGIN [A-Z ]*PRIVATE KEY-----',
    risk: 'high',
    description: 'Material criptográfico privado não pode ficar no Git.',
  },
  {
    label: 'Slack token',
    pattern: 'xox[baprs]-',
    risk: 'high',
    description: 'Tokens Slack públicos devem ser tratados como vazamento.',
  },
  {
    label: 'Placeholders JWT',
    pattern: 'change-me-access-secret|change-me-refresh-secret',
    risk: 'info',
    description: 'Placeholders são esperados, mas não valem como segredo real.',
  },
  {
    label: 'Test secrets',
    pattern: 'test-access-secret-123456|test-refresh-secret-123456',
    risk: 'info',
    description: 'Segredos de teste ajudam a distinguir fixtures de segredos reais.',
  },
  {
    label: 'Local Postgres URL',
    pattern: 'postgres://postgres:postgres@',
    risk: 'info',
    description: 'URLs locais de desenvolvimento não indicam banco de produção.',
  },
]

const ignoredPathspecs = ['--', ':!tools/security/audit-history.ts']

function runGit(args: string[]) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 20 * 1024 * 1024,
  }).trim()
}

function safeGitGrep(pattern: string, revisions: string[]) {
  try {
    const output = runGit(['grep', '-n', '-I', '-E', pattern, ...revisions, ...ignoredPathspecs])
    return output ? output.split('\n').filter(Boolean) : []
  } catch (error) {
    const message = error instanceof Error ? error.message : ''

    if (message.includes('Command failed')) {
      return []
    }

    throw error
  }
}

function truncateMatches(matches: string[], limit = 8) {
  if (matches.length <= limit) {
    return matches
  }

  return [...matches.slice(0, limit), `... ${matches.length - limit} more match(es)`]
}

function main() {
  const revisions = runGit(['rev-list', '--all'])
    .split('\n')
    .filter(Boolean)

  if (!revisions.length) {
    console.log('No git history found to audit.')
    return
  }

  const findings = checks.map((check) => ({
    ...check,
    matches: safeGitGrep(check.pattern, revisions),
  }))

  const highRiskFindings = findings.filter((finding) => finding.risk === 'high' && finding.matches.length > 0)
  const infoFindings = findings.filter((finding) => finding.risk === 'info' && finding.matches.length > 0)

  console.log('Git history secret audit')
  console.log(`Scanned commits: ${revisions.length}`)
  console.log('')

  if (!highRiskFindings.length) {
    console.log('High-risk findings: none')
  } else {
    console.log('High-risk findings detected:')

    for (const finding of highRiskFindings) {
      console.log(`- ${finding.label}: ${finding.description}`)
      for (const match of truncateMatches(finding.matches)) {
        console.log(`  ${match}`)
      }
    }
  }

  if (infoFindings.length) {
    console.log('')
    console.log('Informational findings:')

    for (const finding of infoFindings) {
      console.log(`- ${finding.label}: ${finding.description}`)
      for (const match of truncateMatches(finding.matches, 5)) {
        console.log(`  ${match}`)
      }
    }
  }

  if (highRiskFindings.length) {
    console.log('')
    console.log('Result: FAIL')
    console.log('Action: rotate exposed credentials and rewrite history before open-sourcing the repository.')
    process.exit(1)
  }

  console.log('')
  console.log('Result: OK')
  console.log('No evidence of real production secrets was found in git history using the configured patterns.')
}

main()
