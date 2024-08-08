

class User {

    /**
     * 
     * @param {List<User>} UserDataLike 
     */
    constructor({
        id,email,password,nombres,apellidoPaterno,apellidoMaterno,intentos,estado,documento,activado,celular,nacimiento,direccion,departamento,provincia,distrito,tipoDocumento
    }){
        this.id = id;
        this.email = email;
        this.password = password;
        this.nombres = nombres;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.intentos = intentos;
        this.estado = estado;
        this.documento = documento;
        this.activado = activado;
        this.celular = celular;
        this.nacimiento = nacimiento;
        this.direccion = direccion;
        this.departamento = departamento;
        this.provincia = provincia;
        this.distrito = distrito;
        this.tipoDocumento = tipoDocumento
    };

}

export default User;