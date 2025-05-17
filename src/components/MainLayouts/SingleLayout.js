import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import ReactConfetti from "react-confetti";
import { Outlet } from "react-router-dom";
import NavbarPage2 from "../BodyDiv/NavbarPage";
import SkillProgressbar from "../BodyDiv/SkillProgressbar";

import NavbarPage2 from "../NavbarPage/NavbarPage2";

const SingleLayout = () => {
	const [confettiStart, setConfettiStart] = useState(true);
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		setTimeout(() => {
			setConfettiStart(false);
		}, 8000);
	}, []);
// src/pages/ProjectPage.js

// src/pages/ProjectPage.js

import React from 'react';
import ServiceList from '../components/ServiceList';
import ServiceDetails from '../components/ServiceDetails';

const ProjectPage = () => {
  const [selectedService, setSelectedService] = React.useState(null);

  const handleServiceSelect = (service) => {
	setSelectedService(service);
  };

  return (
	<div>
	  <ServiceList onServiceSelect={handleServiceSelect} />
	  {selectedService && <ServiceDetails service={selectedService} />}
	</div>
  );
};

export default ProjectPage;// src/components/ServiceDetails.js

import React from 'react';

const ServiceDetails = ({ service }) => {
  return (
	<div>
	  <h2>{service.name}</h2>
	  <p>{service.description}</p>
	  {/* Add more service details here */}
	</div>
  );
};

export default ServiceDetails;// src/components/ServiceDetails.js

import React from 'react';

const ServiceDetails = ({ service }) => {
  return (
	<div>
	  <h2>{service.name}</h2>
	  <p>{service.description}</p>
	  {/* Add more service details here */}
	</div>
  );
};

export default ServiceDetails;
import ServiceList from '../components/ServiceList';
import ServiceDetails from '../components/ServiceDetails';

const ProjectPage = () => {
  const [selectedService, setSelectedService] = React.useState(null);

  const handleServiceSelect = (service) => {
	setSelectedService(service);
  };

  return (
	<div>
	  <ServiceList onServiceSelect={handleServiceSelect} />
	  {selectedService && <ServiceDetails service={selectedService} />}
	</div>
  );
};

export default ProjectPage;
	return (
		<div className="min-h-window">
			{/* <h1>this is main page</h1> */}

			 <NavbarPage2 />
			{confettiStart && <ReactConfetti />}
			<Outlet></Outlet>
		</div>
	);
};

export default SingleLayout;
