import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/users.schema';
import { UserDto } from './dtos/user.dto';
import { encode } from './utils/hash';
import { CreateUserDto } from './dtos/createUser.dto';
import { VerificationCode } from './types/type';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<UserDocument>,
    private readonly mailService: MailService
  ) {}

  private verificationCodes: VerificationCode[] = []

  async findOne(username: string): Promise<UserDto> {
    try{
      const user = await this.usersModel.find({ username: username }).exec()
      if(user.length === 1)
        return user[0]
      return null
    }
    catch{
      return null
    }
  }

  async createUser(user: CreateUserDto): Promise<CreateUserDto | string> {
    try{
      const existsUser = await this.usersModel.find({ username: user.username }).exec()
      const existsEmail = await this.usersModel.find({ email: user.email }).exec()
      if(existsUser.length > 0)
        return 'Username already exists'
      if(existsEmail.length > 0)
        return 'Email already exists'
      const newUser = new this.usersModel({...user, password: encode(user.password)})
      await newUser.save()
      return newUser
    }
    catch{
      return 'Something went wrong, please try again later.'
    }
  }

  async createVerificationCode(username: string, mail: string): Promise<boolean>{
    try{
      const verificationCode = String(Math.floor(100000 + Math.random() * 900000))
      const sendMail = await this.mailService.sendVerificationCode(mail, verificationCode)
      if(sendMail){
        const previusCode = this.verificationCodes.find(item => item.username === username)
        if(previusCode !== undefined){
          this.clearCode(previusCode, username)
        }
        const id = setTimeout(() => {
          this.verificationCodes = this.verificationCodes.filter(item => item.username !== username)
        }, 1000 * 120)
        this.verificationCodes.push({ username: username, code: verificationCode, id: id })
        return true
      }
      return false
    }
    catch{
      return false
    }
  }

  clearCode(previusCode: VerificationCode, username: string): void{
    clearTimeout(previusCode.id)
    this.verificationCodes = this.verificationCodes.filter(item => item.username !== username)
  }
  
  verifyCode(username: string, code: string): boolean{
    const verificationCode = this.verificationCodes.find(item => item.username === username)
    if(verificationCode !== undefined && verificationCode.code === code){
      this.clearCode(verificationCode, username)
      return true
    }
    return false
  }

  async resetPassword(username: string, pass: string): Promise<number>{
    try{
      const user = this.usersModel.findOne({ username: username })[0]
      if(user.password === pass)
        return HttpStatus.CONFLICT
      await this.usersModel.updateOne({ username: username }, { password: encode(pass) })
      return HttpStatus.OK
    }
    catch{
      return HttpStatus.INTERNAL_SERVER_ERROR
    }
  }
}