module.exports = is =>
  Object.assign(
    {},
    {
      vibrancy: 'ultra-dark',
      show: false,
      useContentSize: true,
      center: true,
      webPreferences: {
        nodeIntegrationInWorker: true,
      },
    },
    // Fix unavailable vibrancy on non-macOS devices
    !is.macOS() && {
      backgroundColor: '#7f7f7f',
    }
  );
