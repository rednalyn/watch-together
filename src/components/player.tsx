
function Player (videoCode: any)  {
  function url():string {
    const url = `https://www.youtube.com/embed/${videoCode.videoCode}`
    return url
  }
  return (
    <div>
      <iframe
        width="420"
        height="345"
        src={url()}
      ></iframe>
    </div>
  );
};

export default Player;
 