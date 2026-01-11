import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "El nombre de usuario es requerido"],
      unique: true,
      trim: true,
      minlength: [3, "El nombre de usuario debe tener al menos 3 caracteres"],
      maxlength: [30, "El nombre de usuario no puede exceder 30 caracteres"]
    },
    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Por favor ingresa un email válido"]
    },
    passwordHash: {
      type: String,
      required: true
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe"
      }
    ],
    profileImage: {
      type: String,
      default: ""
    },
    bio: {
      type: String,
      maxlength: [200, "La biografía no puede exceder 200 caracteres"],
      default: ""
    }
  },
  { timestamps: true }
);

// Índices
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });

// Método para no enviar passwordHash en respuestas
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

export default mongoose.model("User", UserSchema);