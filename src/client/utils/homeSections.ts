export type HomeSectionId = 'cozinha' | 'cardapio' | 'combo'

export function getHomeSectionFromHash(hash: string): HomeSectionId {
  if (hash === '#cardapio') {
    return 'cardapio'
  }

  if (hash === '#pedido') {
    return 'combo'
  }

  return 'cozinha'
}

export function getHashFromHomeSection(section: HomeSectionId): string {
  if (section === 'cardapio') {
    return '#cardapio'
  }

  if (section === 'combo') {
    return '#pedido'
  }

  return ''
}
