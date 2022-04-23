const Roles = require('./middleware/role')

function emailCheck(email, role) {
    var regExp = new RegExp("[a-z0-9\.-_]*@zigara\.com$", "i");
    match = email.match(regExp);
    if(match){
        role = Roles.Admin
    }
    else{
        role = Roles.User
    }

    console.log(role)
}

let Role;


const email = 'name@zigara.com'
const email2 = 'name@companyName.com'
const email3 = 'no-email-whatsoever'
const email4 = 'name@personal.com'

const name = 'Tobe'
const last = 'Leta'
console.log(`${name}.${last}@zigara.com`)

emailCheck(email, Role)
