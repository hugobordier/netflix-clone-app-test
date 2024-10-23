interface ResearchProps {
  searchTerm: string;
}

const Research = ({ searchTerm }: ResearchProps) => {
  return (
    <div className="absolute top-12 md:top-20 left-0 w-screen h-[calc(100vh-3rem)] bg-black bg-opacity-80 text-white z-40 overflow-auto">
      {/* Ceci permet d'ajuster la hauteur pour que la NavBar reste visible */}
      <div className="p-6">
        <h2 className="text-3xl">Résultats pour : {searchTerm}</h2>

        <div className="mt-4">
          {searchTerm ? (
            <div>
              <p>Affichage des résultats pour : {searchTerm}</p>
              <ul className="mt-2 space-y-2">
                <li className="p-2 bg-gray-800 rounded">Résultat 1</li>
                <li className="p-2 bg-gray-800 rounded">Résultat 2</li>
                <li className="p-2 bg-gray-800 rounded">Résultat 3</li>
              </ul>
            </div>
          ) : (
            <p>Aucun résultat pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Research;
