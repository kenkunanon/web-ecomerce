import React from 'react'

const Home = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold underline mb-4">Expertise</h1>
      <div className="space-y-4">
        <p className="text-lg">
          Proficient in machine learning and deep learning techniques (TensorFlow and PyTorch), with experience deploying models on servers and Raspberry Pi devices.
        </p>
        <div>
          <h2 className="text-2xl font-semibold">Full-Stack Web Development</h2>
          <ul className="list-disc list-inside ml-4">
            <li>
              <strong>Front-End:</strong> Skilled in designing and improving user interfaces using modern frameworks, including React and Angular.
            </li>
            <li>
              <strong>Back-End:</strong> Experienced in developing database systems using MySQL and MongoDB. Proficient in server-side development such as Node.js, PHP, and Flask, and skilled in utilizing RESTful APIs (Express.js/FastAPI) for efficient communication over the HTTP protocol.
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Mobile App Development</h2>
          <p className="text-lg">
            Experience with creating online examinations using Java, XML, and a Firebase database.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home