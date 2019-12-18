export default function() {
  if (window && window.location && window.location.hostname !== 'localhost') {
    // eslint-disable-next-line no-console, max-len
    console.log('%cô', 'font-family: Helvetica; font-size: 35px; color: #111; text-transform: uppercase; background-color: #FFF; padding: 5px 10px 0; line-height: 50px; font-weight: bold;');
    // eslint-disable-next-line no-console, max-len
    console.log('%cBianca Chandôn - design + development → stefanbowerman.com', 'font-family: Helvetica; font-size: 11px; color: #111; text-transform: uppercase; background-color: #FFF; padding: 3px 10px;');
  }
}