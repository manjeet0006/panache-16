export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Handle Prisma Specific Errors
  if (err.code === 'P2002') {
    return res.status(400).json({ error: "A record with this value already exists." });
  }

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
};