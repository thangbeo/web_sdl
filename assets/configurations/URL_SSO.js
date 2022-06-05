const RESPONSE_TYPE = 'code'
const KEY = 'fQ7DBX05Ti6uPY14eUfr73SPpwwa'
const SCOPE = 'openid'
const REDIRECT_URI = 'http://103.147.34.20:10006/'
const URL_TO_LOGIN_SSO = `https://login.yenbai.gov.vn/oauth2/authorize?response_type=${RESPONSE_TYPE}&client_id=${KEY}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}`

const URL = URL_TO_LOGIN_SSO

export default URL
