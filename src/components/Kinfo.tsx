interface KinfoProps {
  details: any;
}

function Kinfo({ details }: KinfoProps) {
  const RashiArray = details.BhavaDetails;
  let Rashi;
  let RashiSwami;
  for (const key of RashiArray) {
    if (Array.isArray(key.Graha) && key.Graha.includes("Chandra")) {
      Rashi = key.Rashi;
      RashiSwami = key["Rashi Swani"];
    }
  }

  return (
    <div>
      <p>
        <strong>Rashi: </strong>
        {Rashi}
      </p>
      <p>
        <strong>Nakshatra: </strong>
        {details.PrimaryData.Details.Naksahtra.Name}
      </p>
      <p>
        <strong>Nakshatra Pada: </strong>
        {details.PrimaryData.Details.Naksahtra.Charan}
      </p>
      <p>
        <strong>Lagna: </strong>
        {details.PrimaryData.Lagna.Sign}
      </p>
      <p>
        <strong>Rashi Swami: </strong>
        {RashiSwami}
      </p>
      <p>
        <strong>Nakshatra Swami: </strong>
        {details.PrimaryData.Details.Naksahtra.Lord}
      </p>
      <p>
        <strong>Gana: </strong>
        {details.PrimaryData.Details.Gan}
      </p>
      <p>
        <strong>Varna: </strong>
        {details.PrimaryData.Details.Varna}
      </p>
      <p>
        <strong>Nadi: </strong>
        {details.PrimaryData.Details.Nadi}
      </p>
    </div>
  );
}

export default Kinfo;
