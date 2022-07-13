
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import LocalFilesService from './localFiles/localFiles.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private localFilesService: LocalFilesService,
    
  ) {}

  /*
  **  Methods used with @Get()
  **    All these methods returns data from user
  */

    // test authentification
  async getById(id: string) {
    const user = await this.userRepository.findOne({ where: {id}});
    if (user) {
      return user;
    }
    throw new HttpException('User doesnt exist', HttpStatus.NOT_FOUND);
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

  async findUserByfirstName(firstName: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { firstName }});
    if (!user)
      throw new HttpException('User not found, nobody exist with this first name.', HttpStatus.NOT_FOUND);
    return user;
  }

  async findUserBylastName(lastName: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { lastName }});
    if (!user)
      throw new HttpException('User not found, nobody exist with this first name.', HttpStatus.NOT_FOUND);
    return user;
  }

  async findUser(all: string): Promise<User[]> {
    const user = await this.userRepository.find({
      where: [
        { firstName: all },
        { lastName: all },
        { email: all },        
      ],
    })
    return user;
  }


   /*
  **  Methods used with @Post() / Put()
  **    All these methods change data 
  */

  // test create user
  async create(body: CreateUserDto): Promise<User> {
    
    const newUser = await this.userRepository.create(body);
    await this.userRepository.save(newUser);
    return newUser;
    // const user: User = new User();;

    // user.firstName = body.firstName;
    // user.lastName = body.lastName;
    // user.biography = body.biography;
    // if (body.role)
    //   user.role = body.role;

    
    // return this.userRepository.save(user);
  }

  // test avatar
  async addAvatar(userId: string, fileData: LocalFilesDto) {
    const avatar = await this.localFilesService.saveLocalFileData(fileData);
    await this.userRepository.update(userId, {
      avatarId: avatar.id
    })
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


}
