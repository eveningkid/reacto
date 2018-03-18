import React from 'react';

export default function TypeCheck(props) {
  return <div>TypeCheck</div>;
}

// import React from 'react';
// import { connect } from 'react-redux';
// import { Badge } from 'antd';
//
// import { command } from '../../utils';
//
// class TypeCheck extends React.Component {
//   static STATUS = {
//     mounting: 0,
//     checkingAvailability: 1,
//     idle: 2,
//     parsing: 3,
//   };
//
//   constructor(props) {
//     super(props);
//     this.state = {
//       isAvailable: false,
//       results: [],
//       status: TypeCheck.STATUS.mounting,
//     };
//   }
//
//   /**
//    * Test if the type checker is available.
//    *
//    * @return {Promise}
//    */
//   isAvailable() {
//     this.setState({ status: TypeCheck.STATUS.checkingAvailability });
//
//     return new Promise((resolve, reject) => {
//       let isInstalled = true;
//       let hasConfigFile = true;
//
//       command('flow status')
//         .onErrorBefore((err) => {
//           isInstalled = false;
//           resolve({ isInstalled, hasConfigFile });
//         })
//         .on('data', (err, data) => {
//           if (err) {
//             if (err.includes('ENOENT')) {
//               // Command 'flow' not available
//               isInstalled = false;
//             } else if (err.includes('Could not find a .flowconfig')) {
//               // '.flowconfig' file is missing
//               hasConfigFile = false;
//             } else {
//               console.error(err);
//             }
//           }
//         })
//         .on('exit', (data) => {
//           resolve({ isInstalled, hasConfigFile });
//         });
//     });
//   }
//
//   // Should install typechecker
//   installTypeChecker() {
//     command('flow init')
//       .on('data', (err, data) => {
//         if (err) {
//           console.log(err);
//         }
//       })
//       .on('exit', () => {
//         console.log('initiated');
//         this.run();
//       });
//   }
//
//   // Should return instructions to install the type checker
//   // Component
//   howToInstall() {
//
//   }
//
//   // Loop that should constantly run
//   run() {
//     this.setState({ status: TypeCheck.STATUS.parsing });
//     let results = [];
//
//     command('flow --json')
//       .on('data', (err, data) => {
//         results.push(data);
//       })
//       .on('exit', () => {
//         results = JSON.parse(results.join(''));
//         this.setState({ status: TypeCheck.STATUS.idle, results });
//         this.haveResults(results);
//         // console.log(results);
//         // TODO: executer ça dès qu'on sauvegarde un fichier plutôt
//         setTimeout(() => this.run(), 15000);
//       });
//   }
//
//   // Code when we manually stop the type checker
//   stop() {
//     // command.kill()
//   }
//
//   haveResults(results) {
//     let filesWithErrors = [];
//
//     if (Array.isArray(results.errors)) {
//       results.errors.forEach((error) => {
//         if (Array.isArray(error.message) && error.message[0]) {
//           filesWithErrors.push(error.message[0].path);
//         }
//       });
//     }
//
//     return filesWithErrors;
//   }
//
//   async componentWillMount() {
//     const { isInstalled, hasConfigFile } = await this.isAvailable();
//
//     let state = { isAvailable: false };
//
//     if (isInstalled && hasConfigFile) {
//       state.isAvailable = true;
//       this.run();
//     } else {
//       state.status = TypeCheck.STATUS.idle;
//
//       if (!isInstalled) {
//         state.howToInstall = this.howToInstall();
//       }
//
//       if (!hasConfigFile) {
//         this.installTypeChecker();
//       }
//     }
//
//     this.setState(state);
//   }
//
//   renderStatus = () => {
//     const { isAvailable, results, status: statusTypeCheck } = this.state;
//
//     let status;
//     let text;
//
//     switch (statusTypeCheck) {
//       default:
//       case TypeCheck.STATUS.mounting:
//         status = 'processing';
//         text = 'Starting';
//         break;
//
//       case TypeCheck.STATUS.checkingAvailability:
//         status = 'processing';
//         text = 'Checking for availability';
//         break;
//
//       case TypeCheck.STATUS.idle:
//         if (isAvailable) {
//           if (results.passed) {
//             status = 'success';
//             text = 'Tests all passed';
//           } else {
//             status = 'error';
//             text = results.errors.length + ' tests failed';
//           }
//         } else {
//           status = 'warning';
//           text = 'Unavailable';
//         }
//         break;
//
//       case TypeCheck.STATUS.parsing:
//         status = 'processing';
//         text = 'Parsing';
//         break;
//     }
//
//     return <Badge status={status} text={text} />;
//   }
//
//   render() {
//     return (
//       <div className={this.props.className}>
//         {this.renderStatus()}
//       </div>
//     );
//   }
// }
//
// export default TypeCheck;
