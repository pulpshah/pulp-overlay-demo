// 'use client';

// import { debounce } from '../lib/utils';
// import { useState, useEffect } from 'react';

// type VoteState = 'default' | 'invalid-1' | 'invalid-2' | 'invalid-3' | 'abstain' | 'valid-1' | 'valid-2' | 'valid-3';

// const getVoteState = (level: number | null): VoteState => {
//   switch (level) {
//     case 1: return 'valid-1';
//     case 2: return 'valid-2';
//     case 3: return 'valid-3';
//     case -1: return 'invalid-1';
//     case -2: return 'invalid-2';
//     case -3: return 'invalid-3';
//     case 0: return 'abstain';
//     default: return 'default';
//   }
// };




// export default function VotingSystem({ email, commentId, startingVoteState, onVoteChange  }: { email: string | null, commentId: string, startingVoteState: number|null, onVoteChange: (commentId: string ,newVoteLevel: number|null) => void }) {
  
//   const [voteState, setVoteState] = useState<VoteState>(getVoteState(startingVoteState));
//   const [showTooltip, setShowTooltip] = useState(false);

//   useEffect(() => {
//     handleVoteChange(voteState);
//   }, [voteState]);

//   const getVoteLevel = (state: VoteState): number | null => {
//     switch (state) {
//       case 'valid-1': return 1;
//       case 'valid-2': return 2;
//       case 'valid-3': return 3;
//       case 'invalid-1': return -1;
//       case 'invalid-2': return -2;
//       case 'invalid-3': return -3;
//       case 'abstain': return 0;
//       default: return null;
//     }
//   };

//   const handleVoteChange = debounce(async (state: VoteState) => {
//     const level = getVoteLevel(state);

//     try {
//       if (level === null) {
//         await fetch('/api/removeVote', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ email, commentId }),
//         });
//       } else {
//         await fetch('/api/vote', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ email, commentId, level }),
//         });
//       }
//       onVoteChange(commentId, level);
//     } catch (error) {
//       console.error('Failed to submit vote:', error);
//     }
//   }, 1000);

//   useEffect(() => {
//     handleVoteChange(voteState);
//   }, [voteState]);

//   const handleValidClick = () => {
//     if (!email) return;
//     setVoteState((prev) => (prev === 'valid-3' ? 'abstain' : prev === 'valid-2' ? 'valid-3' : prev === 'valid-1' ? 'valid-2' : 'valid-1'));
//   };

//   const handleInvalidClick = () => {
//     if (!email) return;
//     setVoteState((prev) => (prev === 'invalid-3' ? 'abstain' : prev === 'invalid-2' ? 'invalid-3' : prev === 'invalid-1' ? 'invalid-2' : 'invalid-1'));
//   };

//   const handleAbstainClick = () => {
//     if (!email) return;
//     setVoteState((prev) => ('abstain'));
//   };

//   const getTopColor = () => (['valid-1', 'valid-2', 'valid-3'].includes(voteState) ? 'bg-green-300' : voteState === 'invalid-3' ? 'bg-red-700' : 'bg-gray-700');
//   const getMiddleColor = () => (voteState === 'abstain' ? 'bg-gray-700 relative' : ['valid-2', 'valid-3'].includes(voteState) ? 'bg-green-500' : ['invalid-2', 'invalid-3'].includes(voteState) ? 'bg-red-500' : 'bg-gray-700');
//   const getBottomColor = () => (voteState === 'valid-3' ? 'bg-green-700' : ['invalid-1', 'invalid-2', 'invalid-3'].includes(voteState) ? 'bg-red-300' : 'bg-gray-700');

//   return (
//     <div
//       className="relative flex flex-col items-center space-y-0"
//       onMouseEnter={() => setShowTooltip(true)}
//       onMouseLeave={() => setShowTooltip(false)}
//     >
//       {/* Tooltip with small login button */}
//       {showTooltip && !email && (
//         <div className="absolute -top-10 bg-black text-white text-xs rounded-md p-2 shadow-md">
//           <button
//             onClick={() => (window.location.href = '/auth/login')}
//             className="bg-blue-500 text-white text-xs py-1 px-2 rounded shadow hover:bg-blue-600"
//           >
//             Login to vote
//           </button>
//         </div>
//       )}

//       {/* Voting sections */}
//       <div className={`w-4 h-10 border border-gray-500 border-b-0 cursor-pointer ${getTopColor()} rounded-t`} onClick={handleValidClick}></div>
//       <div className={`w-4 h-10 border-l border-r border-gray-500 cursor-pointer ${getMiddleColor()}`} onClick={handleAbstainClick}>
//         {voteState === 'abstain' && (
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="w-4 h-4 bg-white rounded-full"></div>
//           </div>
//         )}
//       </div>
//       <div className={`w-4 h-10 border border-gray-500 border-t-0 cursor-pointer ${getBottomColor()} rounded-b`} onClick={handleInvalidClick}></div>
//     </div>
//   );
// }
