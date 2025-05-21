export const goodResponse = ({res, statusCode=201,status=true, message="successfull", data=[],extra}={}) => {
    return res.status(statusCode).json({
        message,
        statusCode,
        data:{isAuthenticated:true,...data},
        status,
        ...extra
    })
}
export const badResponse = ({res, statusCode=401,status=false,error=[], message="access denied", data=[],extra}={}) => {
    return res.status(statusCode).json({
        message,
        status,
        statusCode,
        data:{isAuthenticated:false,...data},
        error,
        ...extra
    })
}