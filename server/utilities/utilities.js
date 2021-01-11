/* -------------------------------------------------------------------------- */
/*                                  UTILITIES                                 */
/* -------------------------------------------------------------------------- */

const returnMessage = (res, status, okValue, message, count,token) => {
  return res.status(status).json({
    ok: okValue,
    message,
    count,
    token
  });
};
module.exports = {
  returnMessage,
};
