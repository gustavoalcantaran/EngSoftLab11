from flask import Flask, request, jsonify
#cross-origin resouce sharing
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
# Lista de tarefas (em memória)
listaTarefas = []
# Rota para listar tarefas
@app.route('/tarefas', methods=['GET'])
def get_tarefas():
    return jsonify(listaTarefas)
# Rota para adicionar uma nova tarefa
@app.route('/tarefas', methods=['POST'])
def add_tarefa():
    data = request.json
    tarefa = {
    "id": len(listaTarefas) + 1,
    "descricao": data['descricao']
    }
    listaTarefas.append(tarefa)
    return jsonify(listaTarefas), 201
# Rota para deletar uma tarefa
@app.route('/tarefas/<int:id>', methods=['DELETE'])
def delete_tarefa(id):
    global listaTarefas
    listaTarefas = [tarefa for tarefa in listaTarefas if tarefa["id"] != id]
    return '', 204
# Rota para alterar uma tarefa existente
@app.route('/tarefas/<int:id>', methods=['PUT'])
def edit_tarefa(id):
    data = request.json
    for tarefa in listaTarefas:
        if tarefa['id'] == id:
              tarefa['descricao'] = data['descricao']
        return jsonify(tarefa)
    return jsonify({"error": "Tarefa não encontrada"}), 404
if __name__ == '__main__':
 app.run(debug=True) 