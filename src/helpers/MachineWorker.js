/**
 * MachineWorker.js
 */

export default function MachineWorker() {
  console.log('Getting to work...')
  const onmessage = e => {
      switch(e.data) {
        case('Load'):
          postMessage("Loaded");
          break;
        default:
          console.log(e.data)
          postMessage("Unknown command!")
      }
  };
}