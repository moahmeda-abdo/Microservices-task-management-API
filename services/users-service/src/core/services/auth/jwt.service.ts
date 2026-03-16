import jwt from 'jsonwebtoken'

export class JWT {
  static sign(data: any): string {
    return jwt.sign(data, process.env.JWT_KEY!);
  }

  static verify(token: string){
    return jwt.verify(token, process.env.JWT_KEY!);
  }

  static decode(token: string){
    return jwt.decode(token)
  }
}