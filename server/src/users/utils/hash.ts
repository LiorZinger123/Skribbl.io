import * as bcrypt from 'bcrypt';

export const encode = (pass: string): string => {
    const SALT = bcrypt.genSaltSync();
    return bcrypt.hashSync(pass, SALT);
}

export const compare = (pass: string, hash: string) => {
    return bcrypt.compareSync(pass, hash)
}