import { hashSync, compareSync} from 'bcrypt'

export class Password {
  static hash(plain: string, rounds: number = 10) {
    return hashSync(plain, rounds)
  }

  static compare(plain: string, hashed: string) {
    return compareSync(plain, hashed)
  }
}