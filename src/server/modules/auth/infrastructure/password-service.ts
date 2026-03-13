import bcrypt from 'bcryptjs'

export class PasswordService {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 10)
  }

  async compare(value: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(value, passwordHash)
  }
}
