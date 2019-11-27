const config = {
  dev: {
    sessionSecret: ["3o4l5hEZAUHFSDFTewr6yq534&"],
    jwtSecret:"UOHo4wihgo6aei573ruhtg1oaserut",
    hashSalt: "pw3789rgw97i8g3riuawgetklga4eiug",
    db:{
      name:"default",
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "test",
    }
  },
  prod: { 
    sessionSecret: ["3o4l5hEZAUHFSDFTewr6yq534&"],
    jwtSecret:"UOHo4wihgo6aei573ruhtg1oaserut",
    hashSalt: "pw3789rgw97i8g3riuawgetklga4eiug",
    db:{
      name:"default",
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "root",
      database: "test",
    }
  }
}

export default  process.env.NODE_ENV && config[process.env.NODE_ENV] ? config[process.env.NODE_ENV] : config.dev;