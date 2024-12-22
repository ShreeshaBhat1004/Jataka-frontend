interface Bhava {
  Bhava: number;
  Graha: string[];
  Rashi: string;
}

interface KundaliProps {
  startNumber: string;
  bhavas: Bhava[];
}

const AscendentMapping: Record<string, number> = {
  mesha: 1,
  vrishabha: 2,
  mithuna: 3,
  karka: 4,
  simha: 5,
  kanya: 6,
  tula: 7,
  vrishchika: 8,
  dhanu: 9,
  makara: 10,
  kumbha: 11,
  meena: 12,
};

function Kundali({ startNumber, bhavas }: KundaliProps) {
  const size = 4;
  const mergedCell = { row: 1, col: 1 };
  const mergedCellSize = 2;
  const totalCells = size * size - mergedCellSize * mergedCellSize;
  const startNumberFromMapping =
    AscendentMapping[startNumber.toLowerCase()] || 1;

  const isMergedCell = (row: number, col: number) =>
    row >= mergedCell.row &&
    row < mergedCell.row + mergedCellSize &&
    col >= mergedCell.col &&
    col < mergedCell.col + mergedCellSize;

  // Compute the clockwise traversal order
  const clockwiseOrder: { row: number; col: number }[] = [];
  for (let col = 0; col < size; col++) {
    if (!isMergedCell(0, col)) clockwiseOrder.push({ row: 0, col });
  }
  for (let row = 1; row < size; row++) {
    if (!isMergedCell(row, size - 1))
      clockwiseOrder.push({ row, col: size - 1 });
  }
  for (let col = size - 2; col >= 0; col--) {
    if (!isMergedCell(size - 1, col))
      clockwiseOrder.push({ row: size - 1, col });
  }
  for (let row = size - 2; row > 0; row--) {
    if (!isMergedCell(row, 0)) clockwiseOrder.push({ row, col: 0 });
  }

  const numberedCells: Record<string, number> = {};
  const bhavaGrahaMapping: Record<number, string> = {};

  bhavas.forEach((bhava) => {
    bhavaGrahaMapping[bhava.Bhava] = bhava.Graha.join(", ");
  });

  let counter = 1;
  for (let i = 0; i < totalCells; i++) {
    const index = (i + startNumberFromMapping) % totalCells;
    const { row, col } = clockwiseOrder[index];
    numberedCells[`${row}-${col}`] = counter++;
  }

  // Identify the first cell based on input
  const startingCell = clockwiseOrder[startNumberFromMapping];

  return (
    <table
      style={{
        border: "2px solid black",
        borderCollapse: "collapse",
      }}
    >
      <tbody>
        {Array(size)
          .fill(null)
          .map((_, row) => (
            <tr key={row}>
              {Array(size)
                .fill(null)
                .map((_, col) => {
                  // Merged center cell
                  if (row === mergedCell.row && col === mergedCell.col) {
                    return (
                      <td
                        key={`${row}-${col}`}
                        rowSpan={mergedCellSize}
                        colSpan={mergedCellSize}
                        style={{
                          width: "200px",
                          height: "200px",
                          border: "2px solid black",
                          textAlign: "center",
                          verticalAlign: "middle",
                          backgroundColor: "#f0f8ff", // Light blue background
                          fontWeight: "bold",
                        }}
                      ></td>
                    );
                  }

                  if (isMergedCell(row, col)) return null;

                  const bhavaNumber = numberedCells[`${row}-${col}`];
                  const isStartingCell =
                    row === startingCell.row && col === startingCell.col;

                  return (
                    <td
                      key={`${row}-${col}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        border: isStartingCell
                          ? "5px double rgba(100, 100, 100, 1)"
                          : "2px solid black",
                        textAlign: "center",
                        verticalAlign: "middle",
                        backgroundColor: isStartingCell ? "#ffebcd" : "white",
                      }}
                    >
                      {isStartingCell ? "Lagna\n" : ""}
                      {bhavaGrahaMapping[bhavaNumber] || ""}
                    </td>
                  );
                })}
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default Kundali;
