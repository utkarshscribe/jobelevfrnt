import React, {useEffect,useState} from 'react';
import { useParams } from 'react-router-dom';

const Resume = () => {
    const { id } = useParams();
    const [resume, setResume] = useState({});
    const userToken = localStorage.getItem('authToken');


    useEffect(() => {
        fetchResume();
    }, [id]);



    const fetchResume = async () => {
        const response = await fetch(`http://jobapi.crmpannel.site/auth/v1/user?id=${id}`,
            {
                headers: {
                    authorization: `Bearer ${userToken}`,
                }
            }
        );
        const data = await response.json();
        setResume(data);
        console.log(data);
    }


    return (
        <div>Resume</div>
    )
}

export default Resume