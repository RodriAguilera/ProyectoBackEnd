import { UsersService } from "../services/users.service.js";

export class UsersController {
  static modifyRole = async (req, res) => {
    try {
      const userId = req.params.uid;
      // Verificar si el usuario está en la base de datos
      const user = await UsersService.getUserById(userId);
      const userRole = user.role;
      // Validación del rol actual y cambio
      if (userRole === "user") {
        user.role = "premium";
      } else if (userRole === "premium") {
        user.role = "user";
      } else {
        return res.json({
          status: "error",
          message: "No se puede cambiar el rol de este usuario",
        });
      }
      await UsersService.updateUser(user._id, user);
      return res.json({
        status: "success",
        message: `El nuevo rol del usuario es ${user.role}`,
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  static getAllUsers = async (req, res) => {
    try {
      const users = await UsersService.getAll();
      res.send({ status: "success", payload: users });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  static getUser = async (req, res) => {
    try {
      const userId = req.params.uid;
      const user = await UsersService.getUserById(userId);
      if (!user) return res.status(404).send({ status: "error", error: "User not found" });
      res.send({ status: "success", payload: user });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  static updateUser = async (req, res) => {
    try {
      const updateBody = req.body;
      const userId = req.params.uid;
      const user = await UsersService.getUserById(userId);
      if (!user) return res.status(404).send({ status: "error", error: "User not found" });
      const result = await UsersService.update(userId, updateBody);
      res.send({ status: "success", message: "User updated" });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  static deleteUser = async (req, res) => {
    try {
      const userId = req.params.uid;
      const result = await UsersService.deleteUser(userId);
      res.send({ status: "success", message: "User deleted" });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };
}
