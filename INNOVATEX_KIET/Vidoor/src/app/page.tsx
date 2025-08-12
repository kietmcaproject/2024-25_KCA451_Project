import ListOfOnlineUsers from "@/components/ListOfOnlineUsers/listofonlineuser";
import CallNotification from "@/components/Notification/CallNotification";
import VideoCall from "@/components/VideoCall/VideoCall";




export default function Home() {
  return (
     <div>
          <ListOfOnlineUsers/>
          <CallNotification/>
          <VideoCall/>
     </div>
  );
}
