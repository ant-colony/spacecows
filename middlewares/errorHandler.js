/* Error-handling middleware component */
export default function errorHandler (err, req, res, next) {
  
  console.log("<=== Error-handling ===>")
  console.log(err)
  
  res.status(err.statusCode || 500).send(err.message)

}
