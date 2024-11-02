import { useSelector } from "react-redux"

export default function Profile() {
  const {currentUser} = useSelector(state => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <img className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' src={currentUser.avatar} alt="Profile" />
        <input type="text" placeholder="Username" id="username" className="border p-3 rounded-lg "/>
        <input type="email" placeholder="Email" id="email" className="border p-3 rounded-lg "/>
        <input type="password" placeholder="Password" id="password" className="border p-3 rounded-lg "/>

        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">update</button>
        
        {/* <h2 className='text-xl mt-5'>{currentUser.username}</h2> */}
        {/* <p className='text-lg text-slate-500'>{currentUser.email}</p> */}
      </form>
    <div className="flex justify-between mt-5">
      <span className="text-red-700 cursor-pointer">Delete account</span>
      <span className="text-red-700 cursor-pointer">Sign out</span>
      
    </div>
    

    </div>
  )
}
