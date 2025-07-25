export interface Announcement {
  id: number
  title: string
  date: string
  time?: string
  location?: string
  type: string
  priority: string
  description: string
  attendees?: string
  image: string
  fullDescription?: string
}

export const announcements: Announcement[] = [
  {
    id: 1,
    title: "Community Clean-up Drive",
    date: "January 28, 2025",
    time: "7:00 AM - 12:00 PM",
    location: "Barangay Plaza",
    type: "Event",
    priority: "high",
    description:
      "Join us for our monthly community clean-up drive this Saturday. Bring your own cleaning materials and help make our barangay cleaner and greener.",
    attendees: "All residents welcome",
    image: "https://picsum.photos/600/400?random=101",
    fullDescription:
      "Join us for our monthly community clean-up drive this Saturday. This is a great opportunity for residents to come together and make our barangay cleaner and greener. We will be focusing on the main streets, parks, and common areas. Please bring your own cleaning materials including gloves, trash bags, and brooms. Light refreshments will be provided. This event is part of our ongoing environmental initiative to maintain the beauty and cleanliness of our community. Volunteers of all ages are welcome, and community service hours will be provided for students who need them.",
  },
  {
    id: 2,
    title: "New Online Services Available",
    date: "January 25, 2025",
    type: "Update",
    priority: "medium",
    description:
      "We're excited to announce that you can now request certificates and permits online through Sindalan Connect. This new system will make it easier and faster to access barangay services.",
    image: "https://picsum.photos/600/400?random=102",
    fullDescription:
      "We're excited to announce the launch of our new digital platform, Sindalan Connect! You can now request certificates and permits online, making it easier and faster to access barangay services. The system includes features for certificate requests, business permit applications, complaint filing, and more. This digital transformation is part of our commitment to providing efficient and accessible services to all residents. The platform is available 24/7 and includes offline functionality for areas with limited internet connectivity. Training sessions for residents who need assistance with the new system will be announced soon.",
  },
  {
    id: 3,
    title: "Barangay Assembly Meeting",
    date: "January 30, 2025",
    time: "6:00 PM - 8:00 PM",
    location: "Community Center",
    type: "Meeting",
    priority: "high",
    description:
      "Monthly barangay assembly meeting to discuss community issues, budget updates, and upcoming projects. All residents are encouraged to attend.",
    attendees: "All registered voters",
    image: "https://picsum.photos/600/400?random=103",
    fullDescription:
      "Join us for our monthly barangay assembly meeting where we will discuss important community issues, provide budget updates, and present upcoming projects for the barangay. This is your opportunity to voice concerns, ask questions, and participate in decision-making processes that affect our community. The agenda includes: budget report for the previous month, updates on ongoing infrastructure projects, discussion of new community programs, and an open forum for resident concerns. All registered voters are encouraged to attend and participate in this democratic process. Light snacks will be provided.",
  },
  {
    id: 4,
    title: "Water Service Interruption",
    date: "February 1, 2025",
    time: "8:00 AM - 5:00 PM",
    type: "Notice",
    priority: "high",
    description:
      "Water service will be temporarily interrupted due to maintenance work on the main pipeline. Please store water in advance.",
    location: "Affected areas: Sitio 1-3",
    image: "https://picsum.photos/600/400?random=104",
    fullDescription:
      "Water service will be temporarily interrupted on February 1, 2025, from 8:00 AM to 5:00 PM due to essential maintenance work on the main pipeline. This maintenance is necessary to ensure the continued reliability and quality of our water supply system. Affected areas include Sitio 1, Sitio 2, and Sitio 3. Residents in these areas are advised to store sufficient water in advance for drinking, cooking, and other essential needs. Water tankers will be stationed at key locations throughout the affected areas for emergency water supply. We apologize for any inconvenience this may cause and appreciate your understanding and cooperation.",
  },
  {
    id: 5,
    title: "Senior Citizens' Health Check-up",
    date: "February 5, 2025",
    time: "8:00 AM - 4:00 PM",
    location: "Barangay Health Center",
    type: "Health",
    priority: "medium",
    description:
      "Free health check-up for senior citizens. Services include blood pressure monitoring, blood sugar testing, and general consultation.",
    attendees: "Senior citizens (60 years old and above)",
    image: "https://picsum.photos/600/400?random=105",
    fullDescription:
      "We are pleased to offer a comprehensive free health check-up program for our senior citizens (60 years old and above). This health screening program includes blood pressure monitoring, blood sugar testing, general consultation with healthcare professionals, and basic health education. The program is designed to promote preventive healthcare and early detection of health issues among our elderly residents. Please bring a valid ID and any existing medical records or prescriptions. The health check-up is conducted by qualified healthcare professionals in partnership with the local health department. Registration is on a first-come, first-served basis, so we encourage early arrival.",
  },
  {
    id: 6,
    title: "Basketball Tournament Registration",
    date: "February 10, 2025",
    type: "Sports",
    priority: "low",
    description:
      "Registration is now open for the annual inter-sitio basketball tournament. Teams must register at the barangay office.",
    location: "Barangay Office",
    image: "https://picsum.photos/600/400?random=106",
    fullDescription:
      "Get ready for the most exciting sporting event of the year! Registration is now open for our annual inter-sitio basketball tournament. This tournament brings together teams from all sitios in our barangay for friendly competition and community bonding. Teams must consist of 8-12 players, with at least 5 players being residents of the sitio they represent. Registration fee is ₱500 per team, which covers tournament expenses and prizes. The tournament will feature both men's and women's divisions, with games scheduled on weekends to accommodate working participants. Prizes will be awarded to the top three teams in each division. Register your team at the barangay office during regular business hours.",
  },
  {
    id: 7,
    title: "Vaccination Drive for Children",
    date: "February 12, 2025",
    time: "9:00 AM - 3:00 PM",
    location: "Barangay Health Center",
    type: "Health",
    priority: "high",
    description: "Free vaccination program for children aged 0-5 years. Bring your child's immunization record.",
    attendees: "Children aged 0-5 years",
    image: "https://picsum.photos/600/400?random=107",
    fullDescription:
      "Protect your children with our free vaccination program! This comprehensive immunization drive is designed for children aged 0-5 years and includes all essential vaccines according to the national immunization schedule. Please bring your child's immunization record or booklet to ensure proper tracking of vaccines received. The program is conducted by licensed healthcare professionals from the Department of Health in partnership with our barangay health center. Vaccines available include those for measles, mumps, rubella, polio, hepatitis B, and other preventable diseases. Parents or guardians must accompany their children and provide consent for vaccination.",
  },
  {
    id: 8,
    title: "Livelihood Training Program",
    date: "February 15, 2025",
    time: "1:00 PM - 5:00 PM",
    location: "Community Center",
    type: "Event",
    priority: "medium",
    description:
      "Learn new skills in food processing, handicrafts, and small business management. Free training with certificates provided.",
    attendees: "Adults 18 years and above",
    image: "https://picsum.photos/600/400?random=108",
    fullDescription:
      "Enhance your skills and create new income opportunities with our comprehensive livelihood training program! This free training covers food processing techniques, handicraft making, and small business management. Participants will learn practical skills that can be turned into profitable home-based businesses. The program includes hands-on workshops, business planning sessions, and networking opportunities with other participants. All materials and tools needed for the training will be provided free of charge. Certificates of completion will be awarded to all participants who complete the full program. This initiative is part of our community development program aimed at improving the economic well-being of our residents.",
  },
]
