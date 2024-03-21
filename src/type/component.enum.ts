export const Component = {
  RestApplication: Symbol.for('RestApplication'),

  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  Crypto: Symbol.for('Crypto'),

  OfferGenerator: Symbol.for('OfferGenerator'),
  OfferParser: Symbol.for('OfferParser'),
  FileWriter: Symbol.for('FileWriter'),
  FileReader: Symbol.for('FileReader'),

  CliApplication: Symbol.for('CliApplication'),

  GenerateCommand: Symbol.for('GenerateCommand'),
  HelpCommand: Symbol.for('HelpCommand'),
  ImportCommand: Symbol.for('ImportCommand'),
  VersionCommand: Symbol.for('VersionCommand'),

  DatabaseClient: Symbol.for('DatabaseClient'),
  ExceptionFilter: Symbol.for('ExceptionFilter'),
  AuthExceptionFilter: Symbol.for('AuthExceptionFilter'),
  HttpExceptionFilter: Symbol.for('HttpExceptionFilter'),
  ValidationExceptionFilter: Symbol.for('ValidationExceptionFilter'),
  AuthService: Symbol.for('AuthService'),
  PathTransformer: Symbol.for('PathTransformer'),

  UserModel: Symbol.for('UserModel'),
  UserService: Symbol.for('UserService'),
  UserRepository: Symbol.for('UserRepository'),
  UserController: Symbol.for('UserController'),

  OfferModel: Symbol.for('OfferModel'),
  OfferService: Symbol.for('OfferService'),
  OfferRepository: Symbol.for('OfferRepository'),
  OfferController: Symbol.for('OfferController'),

  CityModel: Symbol.for('CityModel'),
  CityService: Symbol.for('CityService'),
  CityRepository: Symbol.for('CityRepository'),
  CityController: Symbol.for('CityController'),

  ReviewModel: Symbol.for('ReviewModel'),
  ReviewService: Symbol.for('ReviewService'),
  ReviewRepository: Symbol.for('ReviewRepository'),
  ReviewController: Symbol.for('ReviewController'),

} as const;
