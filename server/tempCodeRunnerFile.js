app.use(cors({
  origin: "http://localhost:5500", // or "*" for testing
  methods: ["GET","POST"],
  allowedHeaders: ["Content-Type"]
}));
