// 'use client';

// import { useEffect, useState } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import VotingSystem from './VotingSystem'; // Import the voting system

// // Define the type for each comment
// type Comment = {
//   id: number;
//   author: string;
//   text: string;
//   createdAt: string;
//   replies: Comment[];
//   userVoteLevel: number|null;
//   isTopLevel: boolean,
// };

// // Function to format the date object into a human-readable string
// const formatDate = (createdAt: { day: any, month: any, year: any, hour: any, minute: any, second: any }): string => {
//   const currentDate = new Date();
//   const date = new Date(
//     createdAt.year.low,
//     createdAt.month.low - 1, // Month is 0-based
//     createdAt.day.low,
//     createdAt.hour.low,
//     createdAt.minute.low,
//     createdAt.second.low
//   );

//   const secondsAgo = Math.floor((currentDate.getTime() - date.getTime()) / 1000);

//   const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

//   if (secondsAgo < 60) return rtf.format(-secondsAgo, "second");
//   const minutesAgo = Math.floor(secondsAgo / 60);
//   if (minutesAgo < 60) return rtf.format(-minutesAgo, "minute");
//   const hoursAgo = Math.floor(minutesAgo / 60);
//   if (hoursAgo < 24) return rtf.format(-hoursAgo, "hour");
//   const daysAgo = Math.floor(hoursAgo / 24);
//   if (daysAgo < 30) return rtf.format(-daysAgo, "day");
//   return date.toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric"
//   });
// };

// const convertComments = (array: any[]): Comment[] => {
//   const commentMap: { [key: string]: Comment } = {};
//   const topLevelComments: Comment[] = [];

//   array.forEach((item) => {
//     const comment: Comment = {
//       id: item.id,
//       author: item.author,
//       text: item.text,
//       createdAt: formatDate(item.createdAt),
//       replies: [],
//       userVoteLevel: item.userVoteLevel,
//       isTopLevel: !item.parentId  // Set to true if no parentId, otherwise false
//     };

//     commentMap[item.id] = comment;

//     if (item.parentId) {
//       // This is a reply, push it to the parent comment's replies
//       commentMap[item.parentId]?.replies.push(comment);
//     } else {
//       // Top-level comment
//       topLevelComments.push(comment);
//     }
//   });
//   return topLevelComments;
// };

// // Truncate text to show only the first 3-4 words
// const truncateText = (text: string, wordLimit: number = 3) => {
//   const words = text.split(' ');
//   if (words.length > wordLimit) {
//     return words.slice(0, wordLimit).join(' ') + '...';
//   }
//   return text;
// };

// export default function CommentsTab({ slug, email }: { slug: string, email: string | null }) {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [replyView, setReplyView] = useState<Comment | null>(null);
//   const [breadcrumb, setBreadcrumb] = useState<Comment[]>([]);
//   const [isParentCollapsed, setIsParentCollapsed] = useState<boolean>(true);
//   const [loading, setLoading] = useState(true);
//   const [replyText, setReplyText] = useState<string>(''); // State for reply text input

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         setLoading(true);
        
//         const response = await fetch('/api/comments', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             slug: slug,
//             userEmail: email,
//           }), 
//         });

//         const data = await response.json();
//         if (response.ok) {
//           console.log(data)
//           setComments(convertComments(data));
//         } else {
//           console.error('Error fetching comments:', data.error);
//         }
//       } catch (error) {
//         console.error('Error fetching comments:', error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, [slug]);

//   const handleViewReplies = (comment: Comment) => 
//   {
//     if (comment.isTopLevel && comment.userVoteLevel == null) 
//     {
//       toast.info("You need to vote before seeing the replies");
//     } 
//     else
//     {
//       setBreadcrumb([...breadcrumb, comment]);
//       setReplyView(comment);
//       setIsParentCollapsed(true);
//     }
//   };

//   const handleBreadcrumbClick = (index: number) => {
//     const updatedBreadcrumbs = breadcrumb.slice(0, index);
//     if (index === 0) {
//       setReplyView(null);
//       setBreadcrumb([]);
//     } else {
//       const selectedComment = updatedBreadcrumbs[index - 1];
//       setBreadcrumb(updatedBreadcrumbs);
//       setReplyView(selectedComment);
//     }
//   };

//   // Submit reply function
//   const handleReplySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     console.log(replyView?.id);
//     event.preventDefault();

//     if (!email) {
//       toast.error('You need to log in to reply');
//       return;
//     }

//     try {
//       const response = replyView
//         ? await fetch('/api/addReplyToComment', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               commentId: replyView.id,
//               text: replyText,
//               email,
//             }),
//           })
//         : await fetch('/api/addReplyToBlog', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               slug,
//               text: replyText,
//               email,
//             }),
//           });

//       if (!response.ok) {
//         throw new Error('Failed to add reply');
//       }

//       // Fetch updated comments
//       try {
//         const fetchResponse = await fetch('/api/comments', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             slug: slug,
//             userEmail: email,
//           }),
//         });
//         const data = await fetchResponse.json();
        
//         if (fetchResponse.ok && Array.isArray(data)) {
//           const updatedComments = convertComments(data);

//           // Update comments in state
//           setComments(updatedComments);

//           // Find the updated replyView in the newly fetched comments
//           if (replyView) {
//             const findReplyView = (comments: Comment[], targetId: number): Comment | null => {
//               for (const comment of comments) {
//                 if (comment.id === targetId) return comment;
//                 const foundInReplies = findReplyView(comment.replies, targetId);
//                 if (foundInReplies) return foundInReplies;
//               }
//               return null;
//             };

//             const updatedReplyView = findReplyView(updatedComments, replyView.id);
//             setReplyView(updatedReplyView || null);
//           }
//         } else {
//           console.error('Error fetching comments or data is not an array:', data?.error || data);
//         }
//       } catch (fetchError) {
//         console.error('Error fetching comments:', fetchError);
//       }

//       // Clear the reply text input after submission
//       setReplyText('');
//       toast.success('Reply added successfully');
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Failed to add reply');
//     }
//   };

//   if (loading) {
//     return <div>Loading comments...</div>;
//   }

//   const updateVoteLevel = (commentId:string, newVoteLevel:number|null) => {
//     setComments(prevComments =>
//       prevComments.map(comment =>
//         String(comment.id) === commentId
//           ? { ...comment, userVoteLevel: newVoteLevel }
//           : comment
//       )
//     );
//   };

//   return (
//     <div className="flex flex-col h-full bg-gray-900 text-white p-4 max-w-lg mx-auto rounded-lg shadow-lg">
//       <ToastContainer />
//       <div className="flex flex-col h-[500px]">
//         {breadcrumb.length > 0 && (
//           <div className="p-2 bg-gray-800 text-gray-300 rounded-md mb-4">
//             {breadcrumb.map((crumb, idx) => (
//               <span
//                 key={crumb.id}
//                 onClick={() => handleBreadcrumbClick(idx)}
//                 className="text-blue-500 cursor-pointer"
//               >
//                 {truncateText(crumb.text)} {idx < breadcrumb.length - 1 && '>'}
//               </span>
//             ))}
//           </div>
//         )}

//         {replyView ? (
//           <div className="mb-4 p-2 bg-gray-800 text-gray-300 rounded-lg shadow-lg text-sm">
//             <div className="flex justify-between items-center">
//               <div className="font-bold">{replyView.author}</div>
//               <button
//                 className="text-xs text-blue-400"
//                 onClick={() => setIsParentCollapsed(!isParentCollapsed)}
//               >
//                 {isParentCollapsed ? 'Expand' : 'Collapse'}
//               </button>
//             </div>
//             <div className="text-xs text-gray-500">{replyView.createdAt}</div>
//             <div className="my-2">
//               {isParentCollapsed
//                 ? truncateText(replyView.text, 10)
//                 : replyView.text}
//             </div>
//           </div>
//         ) : <></>}

//         <div className="flex-1 overflow-y-auto">
//           {(replyView ? replyView.replies : comments).map((comment) => (
//             <div
//               key={comment.id}
//               className="flex items-start mb-4 p-4 rounded-lg shadow-lg bg-gray-800 text-gray-300"
//             >
//               {/* Left section: comment content */}
//               <div className="flex-1">
//                 {replyView && (
//                   <div className="text-sm text-gray-400 mb-2">
//                     Replying to: {replyView.author}
//                   </div>
//                 )}
//                 { (comment.isTopLevel && comment.userVoteLevel==null)? 
//                   <div className="font-bold mb-1 blur">{comment.author}</div> : 
//                   <div className="font-bold mb-1">{comment.author}</div>
//                 }
                
//                 <div className="text-sm text-gray-500">{comment.createdAt}</div>
//                 <div className="my-2">{comment.text}</div>

//                 {comment.replies.length > 0 ? (
//                   <button
//                     onClick={() => handleViewReplies(comment)}
//                     className="text-blue-400 text-sm"
//                   >
//                     {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => handleViewReplies(comment)}
//                     className="text-blue-400 text-sm"
//                   >
//                     Add a reply
//                   </button>
//                 )}
//               </div>
              
//               {/* Right section: voting system, vertically centered */}
//               <div className="flex items-center justify-center">
//                 <VotingSystem email={email || ""} commentId={String(comment.id)} startingVoteState={comment.userVoteLevel} onVoteChange={updateVoteLevel}/>
//               </div>
//             </div>
//           ))}
//         </div>

//         <form onSubmit={handleReplySubmit} className="border-t border-gray-700 p-2 flex bg-gray-800 rounded-lg mt-4">
//           <input
//             type="text"
//             value={replyText}
//             onChange={(e) => setReplyText(e.target.value)}
//             className="flex-1 bg-gray-900 text-white border-none rounded p-2 outline-none"
//             placeholder={replyView ? 'Reply to comment...' : 'Add a comment...'}
//             required // Makes the input field required
//           />
//           <button type="submit" className="bg-blue-500 text-white rounded px-4 ml-2">
//             Send
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
'use client';

import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CommentsTab() {
  return (
    <div className="flex flex-col h-full bg-gray-900 text-white p-4 max-w-lg mx-auto rounded-lg shadow-lg">
      <ToastContainer />
      <div className="flex flex-col h-[500px]">
        {/* Placeholder for content */}
        <div className="flex-1 overflow-y-auto">
          <div className="mb-4 p-4 rounded-lg shadow-lg bg-gray-800 text-gray-300">
            <div className="text-sm text-gray-500">No content available</div>
          </div>
        </div>

        {/* Placeholder for input form */}
        <form className="border-t border-gray-700 p-2 flex bg-gray-800 rounded-lg mt-4">
          <input
            type="text"
            className="flex-1 bg-gray-900 text-white border-none rounded p-2 outline-none"
            placeholder="Input text here..."
            required
          />
          <button type="submit" className="bg-blue-500 text-white rounded px-4 ml-2">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
