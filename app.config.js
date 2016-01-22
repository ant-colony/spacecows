export default function config() {

  return {
    httpPort:8081,
    secret: "KillTheCat",
    tokenExpiration: 20000, // seconds
    constraints: { // constraints for cow
      border:5,
      width: 600,
      height: 400,
      maxVelocity: 5
    }
  };

}

