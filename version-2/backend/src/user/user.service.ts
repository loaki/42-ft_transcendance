
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { BioDTO, CreateUserDto, EmailDTO, PseudoDTO } from './create-user.dto';
import LocalFilesService from './localFiles/localFiles.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private localFilesService: LocalFilesService,
    
  ) {}

  // test google auth
  async setTwoFactorAuthenticationSecret(secret: string, userId: string) {
    return this.userRepository.update({id: userId}, {twoFactorAuthenticationSecret: secret});
  }

  async turnOnTwoFactor(userId: string) {
    return this.userRepository.update(userId, {isTwoFactorAuthentificationEnabled: true});
  }


  async getLogin42(login42: string) {
    const user = await this.userRepository.findOne({ where: {login42}})
    if (user) {
      return user;
    }
    
  }



  async findUserByLogin(login42: string) {
    const user = await this.userRepository.findOne({ where: {login42}})
    if (user)
      return user;
    throw new HttpException('Cannot get the firstname with this id.', HttpStatus.NOT_FOUND);
  }
  // /*
  // **  Methods used with @Get()
  // **    All these methods returns data from user
  // */

  // // Return the firstname of the user. Otherwise return and error
  // async getFirstName(id: string) {
  //   const user = await this.userRepository.findOne({ where: {id}});
  //   if (user)
  //     return user.firstName;
  //   throw new HttpException('Cannot get the firstname with this id.', HttpStatus.NOT_FOUND);
  // }

  // // Return the lastname of the user. Otherwise return and error
  // async getLastName(id: string) {
  //   const user = await this.userRepository.findOne({ where: {id}});
  //   if (user)
  //     return user.lastName;
  //   throw new HttpException('Cannot get the lastname with this id.', HttpStatus.NOT_FOUND);
  // }

  // // Return the biography of the user. Otherwise return and error
  // async getBiography(id: string) {
  //   const user = await this.userRepository.findOne({ where: {id}});
  //   if (user)
  //     return user.biography;
  //   throw new HttpException('Cannot get the biography with this id.', HttpStatus.NOT_FOUND);
  // }

  // // Return the pseudo of the user. Otherwise return and error
  // async getPseudo(id: string) {
  //   const user = await this.userRepository.findOne({ where: {id}});
  //   if (user)
  //     return user.pseudo;
  //   throw new HttpException('Cannot get the pseudonyme with this id.', HttpStatus.NOT_FOUND);
  // }

  // // Return the email of the user. Otherwise return and error
  // async getEmail(id: string) {
  //   const user = await this.userRepository.findOne({ where: {id}});
  //   if (user)
  //     return user.email;
  //   throw new HttpException('Cannot get the email with this id.', HttpStatus.NOT_FOUND);
  // }
  



  ///////////////////////////////////////////


    // test authentification
  async getById(id: string) {
    const user = await this.userRepository.findOne({ where: {id}});
    if (user) {
      return user;
    }
    throw new HttpException('User doesnt exist with this id', HttpStatus.NOT_FOUND);
  }


  findAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }});
    if (!user)
      throw new HttpException('User not found, try again ;-)', HttpStatus.NOT_FOUND);
    else
      return user;
  }


  async findUserLogin42(login42: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { login42 }});
    if (!user)
      throw new HttpException('User not found, nobody exist with this first name.', HttpStatus.NOT_FOUND);
    return user;
  }



  // async findUserByfirstName(firstName: string): Promise<User> {
  //   const user = await this.userRepository.findOne({ where: { firstName }});
  //   if (!user)
  //     throw new HttpException('User not found, nobody exist with this first name.', HttpStatus.NOT_FOUND);
  //   return user;
  // }

  // async findUserBylastName(lastName: string): Promise<User> {
  //   const user = await this.userRepository.findOne({ where: { lastName }});
  //   if (!user)
  //     throw new HttpException('User not found, nobody exist with this first name.', HttpStatus.NOT_FOUND);
  //   return user;
  // }

  // async findUser(all: string): Promise<User[]> {
  //   const user = await this.userRepository.find({
  //     where: [
  //       { firstName: all },
  //       { lastName: all },
  //       { email: all },        
  //     ],
  //   })
  //   return user;
  // }


   /*
  **  Methods used with @Post() / Put()
  **    All these methods change data 
  */

  async create42(body: Partial<User>) {
    const newUser = await this.userRepository.create(body);
    await this.userRepository.save(newUser);
    return newUser;
  }

  // // test create user
  // async create(body: CreateUserDto): Promise<User> {

  //   const user = await this.userRepository.findOne({ where: { firstName: body.firstName }});

  //   if (user)
  //     throw new HttpException('This user exists', HttpStatus.NOT_FOUND);
  
  //   const newUser = await this.userRepository.create(body);
  //   await this.userRepository.save(newUser);
  //   return newUser;

  // }

  // test avatar
  async addAvatar(userId: string, fileData: LocalFilesDto) {
    const avatar = await this.localFilesService.saveLocalFileData(fileData);
    await this.userRepository.update(userId, {
      avatarId: avatar.id
    })
  }


  // test add friend
  async addFriend(userId: string, userName: string) {
    console.log("Dans addFriend: ", userId, userName);
  }


   /*
  **  Method used with @Delete()
  **    
  */
  // This function delete the user from the database
  async removeUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id }});
    if (user)
      await this.userRepository.delete(id);
    else
      throw new HttpException('User not found, try again ;-)', HttpStatus.NOT_FOUND);
  }










  // async putOnline(login42: string) {
  //   const user = await this.userRepository.findOne({ where: {login42: login42}});
  //   if (user) {
  //     try {

  //       await this.userRepository.update(login42, {status: Status.ONLINE})
  //       return {
  //         sucess: true,
  //         message: 'Pseudo updated'
  //       };
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // }







  // /*
  // **  Methods are used with @Put()
  // **    All these methods change/update data in the database
  // */
  // async updatePseudo(id: string, newPseudo: PseudoDTO) {
  //   const user = await this.userRepository.findOne({ where: {id}})
  //   if (user)
  //   {
  //     try {

  //       await this.userRepository.update(id, {pseudo: newPseudo.pseudo})
  //       return {
  //         sucess: true,
  //         message: 'Pseudo updated'
  //       };
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  //   throw new HttpException('Cannot change the pseudo with this id', HttpStatus.NOT_FOUND);
  // }

  // async updateBiography(id: string, newBio: BioDTO) {
  //   const user = await this.userRepository.findOne({ where: {id}})
  //   if (user)
  //   {
  //     try {

  //       await this.userRepository.update(id, {pseudo: newBio.biography})
  //       return {
  //         sucess: true,
  //         message: 'Biography updated'
  //       };
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  //   throw new HttpException('Cannot change the biography with this id', HttpStatus.NOT_FOUND);
  // }

  // async updateEmail(id: string, newEmail: EmailDTO) {
  //   const user = await this.userRepository.findOne({ where: {id}})
  //   if (user)
  //   {
  //     try {

  //       await this.userRepository.update(id, {pseudo: newEmail.email})
  //       return {
  //         sucess: true,
  //         message: 'Biography updated'
  //       };
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  //   throw new HttpException('Cannot change the biography with this id', HttpStatus.NOT_FOUND);
  // }

}
