from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from config import config
from flask_cors import CORS


app = Flask(__name__)
mysqlconnetion = MySQL(app)
CORS(app)

@app.route("/", methods=["GET"])
def index():
    return "<h1>El server villacrud esta prendido</h1>"

@app.route("/students", methods=["GET"])
def mostrar_estudiantes():
    try:
        cursor = mysqlconnetion.connection.cursor()
        cursor.execute("SELECT * FROM students")
        data = cursor.fetchall()
        cursor.close()      # cierra la conexion
        students = []

        for fila in data:
            student = {
                "id": fila[0],
                "name": fila[1],
                "grade": fila[2]
            }
            students.append(student)

        return jsonify({"Students": students})
    except Exception as ex:
        return jsonify({"Error": f"Ha ocurrido un error inesperado, {ex}"}), 500

@app.route("/students", methods=["POST"])
def agregar_estudiante():
    try:
        cursor = mysqlconnetion.connection.cursor()
        query = f"INSERT INTO students (name, grade) VALUES ('{request.json['name']}', '{request.json['grade']}')"
        cursor.execute(query)
        mysqlconnetion.connection.commit()
        cursor.close()
        return jsonify({"Message": "Se registro el alumno con exito"}), 201
    except Exception as ex:
        return jsonify({"Error": f"Ha ocurrido un error inesperado, {ex}"}), 500

@app.route("/students/<int:id>", methods=["PUT"])
def actualizar_estudiante(id):
    try:
        data = request.get_json()
        name = data.get("name")
        grade = data.get("grade")
        cursor = mysqlconnetion.connection.cursor()
        cursor.execute("UPDATE students SET name = %s, grade = %s WHERE id = %s", (name, grade, id))
        mysqlconnetion.connection.commit()
        cursor.close()
        return jsonify({"Message": "Estudiante actualizado"})
    except Exception as ex:
        return jsonify({"Error": f"Ha sucedido un error inesperado, {ex}"}), 500

# Ruta para eliminar un estudiante
@app.route("/students/<int:id>", methods=["DELETE"])
def borrar_estudiante(id):
    try:
        cursor = mysqlconnetion.connection.cursor()
        print(id)
        cursor.execute("DELETE FROM students WHERE id = %s", (id,))
        mysqlconnetion.connection.commit()
        cursor.close()
        return jsonify({"Message": "Estudiante eliminado con exito"})
    except Exception as ex:
        return jsonify({"Error": f"Ha sucedido un error inesperado, {ex}"}), 500



if __name__ == "__main__":
    app.config.from_object(config["development"])
    app.run()