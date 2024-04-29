import axios from "axios";

class MessageService {

    //Function to take raw message json and replace the user ids with names.
    async renderMessages(messageData) {
        console.log("Successfully called renderMessages");
        for (const element of messageData) {

            //overwrite the fromUser ID with name
            try {
                const newFromUser = await axios.get(`http://localhost:4000/api/users/${element.fromUser}`);
                element.fromUser = newFromUser.data.firstName + " " + newFromUser.data.lastName;
            } catch (error) {
                element.fromUser = "Deleted User";
            }

            //make an array of toUsers with names
            //This needs to be a nested for loop, as "toUsers" is an array.
            const newToUsers = [];
            for (const user of element.toUsers) {
                try {
                    if (newToUsers.length > 0){
                        newToUsers.push(", ");
                    }
                    const rawUser = await axios.get(`http://localhost:4000/api/users/${user}`);
                    newToUsers.push(rawUser.data.firstName + " " + rawUser.data.lastName);
                } catch (error) {
                    newToUsers.push("Deleted User");
                }
                
            }
            
            //Replace the old ID array with the new name array
            element.toUsers = newToUsers
        }

        return messageData;
    }

}

const messageService = new MessageService();
export default messageService;