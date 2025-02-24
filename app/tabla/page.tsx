export default function Tabla() {
    return (
      <div>
        <h1 className="text-2xl font-bold text-blue-600">Tabla de Posiciones</h1>
        <table className="mt-4 border w-full">
          <thead>
            <tr className="bg-gray-200">
              <th>Posición</th>
              <th>Equipo</th>
              <th>Puntos</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>United Family</td>
              <td>30</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Equipo B</td>
              <td>28</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  