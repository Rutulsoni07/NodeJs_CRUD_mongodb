const validate = (username, email, password, msg={})=>{
    let result = true
    [result,msg]= validateUsername(username,msg)
    [result,msg]= validateEmail(email,msg)
    [result,msg]= validatePassword(password,msg)
    return[result,msg]
}

const validateUsername = (username,msg={})=>{
    return [result,msg]
}
const validateEmail = (email, msg = {}) => {
  return [result, msg];
};
const validatePassword = (password, msg = {}) => {
  return [result, msg];
};

module.exports={validate,validateUsername,validateEmail,validatePassword}