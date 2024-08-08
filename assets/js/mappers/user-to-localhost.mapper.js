import { User } from "../../../src/user/models/user"

/**
 * 
 * @param {User} user 
 */
export const userModelToLocalhost = (user) => {
    const {
        id,
        email,
        password,
        nombres,
        apellidoPaterno,
        apellidoMaterno,
        intentos,
        estado,
        documento,
        activado,
        celular,
        nacimiento,
        direccion,
        departamento,
        provincia,
        distrito,
        tipoDocumento
    } = user

    return{
        id,
        email,
        Password: password,
        Nombres: nombres,
        ApellidoPaterno: apellidoPaterno,
        ApellidoMaterno: apellidoMaterno,
        intentos,
        estado,
        documento,
        activado,
        celular,
        nacimiento,
        direccion,
        departamento,
        provincia,
        distrito,
        TipoDocumento: tipoDocumento,
    }
}