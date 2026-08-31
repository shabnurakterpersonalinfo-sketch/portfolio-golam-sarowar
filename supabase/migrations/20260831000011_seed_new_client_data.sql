-- ============================================================================
-- 014_seed_new_client_data.sql
-- Seeds the portfolio database with Mohammad Golam Sarowar's profile data,
-- extracted from his CV, replacing the previous client's data.
--
-- IMPORTANT — READ BEFORE RUNNING:
--   1. Run this ONLY against a Supabase project dedicated to this client.
--      Do NOT run it against a project that still serves another client's
--      live portfolio — the DELETE statements below are destructive.
--   2. Run scripts 001, 003, 006, and 007-013 first (schema + RLS + later
--      columns/buckets) if you are setting up a brand-new Supabase project.
--   3. This script clears and re-seeds ALL rows in the tables below. Take a
--      backup first if the project already has data you want to keep.
--   4. After running, log in at /auth/login and use the /admin panel to add
--      a profile photo, LinkedIn/GitHub links, and any certification/award
--      images — those are not set here.
-- ============================================================================

-- Clear existing data (safe order respecting no FK dependencies here)
DELETE FROM certifications;
DELETE FROM scholarly_activities;
DELETE FROM volunteering;
DELETE FROM awards;
DELETE FROM skills;
DELETE FROM publications;
DELETE FROM experiences;
DELETE FROM education;
DELETE FROM profiles;

-- ----------------------------------------------------------------------------
-- Profile
-- ----------------------------------------------------------------------------
INSERT INTO profiles (full_name, title, bio, email, phone, address, profile_image, linkedin_url, facebook_url)
VALUES (
  'Mohammad Golam Sarowar',
  'Network Engineer & Researcher | Core IP Networks, IoT & AI/ML',
  'I am a network engineer and researcher specializing in distributed and intelligent computing, with a particular interest in Data Science, AI/ML, IoT, and Federated Learning for developing secure, privacy-aware, and reliable digital systems. My professional background in core IP networking and network security supports my research into resilient distributed architectures and intelligent networked systems. I currently serve as Assistant Manager - Core IP Network at Digi Jadoo Broadband Ltd., where I manage BGP/OSPF/MPLS routing, IPv4/IPv6 deployment, and ISP backbone infrastructure, while contributing to academic research on distributed telemedicine systems and IoT-based supply chain traceability.',
  'mohammad.sarowar06@gmail.com',
  '+880 1876-473956',
  'Khilkhet, Dhaka, Bangladesh',
  '/placeholder.svg?height=400&width=400',
  NULL,
  NULL
);

-- ----------------------------------------------------------------------------
-- Education (most recent first)
-- ----------------------------------------------------------------------------
INSERT INTO education (institution, degree, field_of_study, start_date, end_date, cgpa, location, achievements, status, display_order)
VALUES
(
  'Bangladesh University',
  'Bachelor of Science (BSc) in Computer Science and Engineering',
  'Computer Science and Engineering',
  '2020',
  '2024',
  'CGPA: 3.64/4.00',
  'Dhaka, Bangladesh',
  'Project Title: Design, Implementation, and Performance Analysis of Linux-Based Networking Using Ubuntu Server. Grading scale: 80% and above = 4.00; 75-<80% = 3.75; 70-<75% = 3.50 (4.00-point scale).',
  'Completed',
  1
),
(
  'Feni Polytechnic Institute (Bangladesh Technical Education Board)',
  'Diploma in Engineering in Computer Technology',
  'Computer Technology',
  '2012',
  '2016 (Result Published 2017)',
  'CGPA: 3.38/4.00 — Academic Rank: 3rd of 40',
  'Feni, Bangladesh',
  'Industrial Training: 6 Credit Hours — Grade A+ (4.00/4.00). 4-Year Program, Examination 2016.',
  'Completed',
  2
),
(
  'Hazrat Shah Sufi Main Uddin Shah (R.) Dakhil Madrasah',
  'Dakhil (Secondary School Certificate Equivalent)',
  'General',
  '2008',
  '2012',
  'GPA: 4.81/5.00 — Academic Rank: 2nd of 36',
  'Chattogram, Bangladesh',
  'Board: Bangladesh Madrasah Education Board, Dhaka.',
  'Completed',
  3
);

-- ----------------------------------------------------------------------------
-- Experiences — Industry (ISP / Core IP Networking)
-- ----------------------------------------------------------------------------
INSERT INTO experiences (position, organization, project_name, start_date, end_date, location, employment_type, description, responsibilities, category, display_order)
VALUES
(
  'Assistant Manager – Core IP Network',
  'Digi Jadoo Broadband Ltd.',
  'Core Network Expansion & BGP Traffic Engineering',
  'Jul 2023',
  'Present',
  'Dhaka, Bangladesh',
  'Full Time',
  'Telecommunications / Internet Service Provider (ISP). Manage and optimize Core IP network infrastructure, ensuring network availability, scalability, performance, and reliability. Also leads Network Operations as Team Leader, supervising day-to-day NOC operations.',
  ARRAY[
    'Configure, monitor, and troubleshoot BGP, OSPF, MPLS, IPv4/IPv6, routing, switching, and traffic-engineering solutions across ISP backbone networks',
    'Analyze network traffic, routing behaviour, bandwidth utilization, and network performance to identify and resolve operational issues',
    'Manage BGP routing policies, peering, IP transit, and CDN traffic, coordinating with upstream providers and network partners',
    'Perform network monitoring, incident troubleshooting, root-cause analysis, capacity planning, and infrastructure upgrades',
    'Contribute to Core Network Expansion, BGP Traffic Engineering, CDN Integration & Optimization, IPv6 Deployment, and ISP Backbone Upgrades',
    'Lead Network Operations activities as Team Leader — supervise team members, provide technical guidance, and coordinate with clients, vendors, and technical teams to resolve critical network issues'
  ],
  'Industry',
  1
),
(
  'Senior Engineer – Technical Department',
  'Link3 Technologies Ltd.',
  NULL,
  'Mar 2022',
  'Jun 2023',
  'Dhaka, Bangladesh',
  'Full Time',
  'Telecommunications / Internet Service Provider (ISP). Managed and maintained ISP network infrastructure to support stable, reliable, and high-availability connectivity.',
  ARRAY[
    'Configured and troubleshot BGP, OSPF, VLANs, PPPoE, routing, switching, and IPv4/IPv6 networks',
    'Performed network monitoring, fault analysis, and incident resolution across Cisco, Juniper, Huawei, and MikroTik platforms',
    'Coordinated with NOC teams, upstream providers, and technical teams for network troubleshooting, maintenance, and service restoration',
    'Maintained network configurations and technical documentation while supporting day-to-day ISP network operations'
  ],
  'Industry',
  2
);

-- ----------------------------------------------------------------------------
-- Experiences — Research / Academic
-- ----------------------------------------------------------------------------
INSERT INTO experiences (position, organization, project_name, start_date, end_date, location, employment_type, description, responsibilities, category, display_order)
VALUES
(
  'Research Coordinator',
  'Collaborative Research Team',
  'Distributed Telemedicine Systems in Bangladesh: A Review of AI, Federated Learning, IoMT, Blockchain, and Edge Computing for Secure Rural Healthcare',
  '2026',
  'Present',
  'Remote / Bangladesh',
  'Voluntary',
  '2nd Author, under the supervision of Rafat Ara, Assistant Professor & PhD Researcher, Dept. of CSE, University of Information Technology & Sciences (UITS), Bangladesh.',
  ARRAY[
    'Conducting a comprehensive review of distributed telemedicine systems, focusing on the integration of AI, Federated Learning, IoMT, Blockchain, and Edge Computing',
    'Investigating security, privacy, accessibility, and technological challenges in distributed healthcare systems, with emphasis on rural healthcare in Bangladesh',
    'Reviewing existing research to identify technology gaps, challenges, and future research directions for secure and scalable digital healthcare',
    'Coordinating research activities, literature review, technical discussions, and preparation of research outcomes across the collaborative team'
  ],
  'Research',
  1
),
(
  'Researcher & Co-Author',
  'International Conference on Technological Intelligence and Business Strategies (TIBS 2026)',
  'IoT-Based Smart Contract Framework for Rice Supply Chain Traceability Recall System and Consumer Safety',
  '2026',
  '2026',
  'Manila, Philippines (Online Presentation)',
  'Contract / Project',
  'Contributed to research on an IoT and smart-contract-based framework for rice supply-chain traceability, product recall, and consumer safety. Paper selected for publication in connection with TIBS 2026, subject to Springer publication guidelines.',
  ARRAY[
    'Explored the application of IoT and blockchain-based smart contracts to improve transparency, traceability, and reliability in the agricultural supply chain',
    'Presented the research paper at TIBS 2026 through an online conference presentation',
    'Discussed the IoT- and smart-contract-based framework for improving supply-chain traceability, product recall, data integrity, and consumer safety'
  ],
  'Research',
  2
),
(
  'Project Leader – Linux-Based System Administration & Network Infrastructure',
  'Bangladesh University',
  'Enterprise Linux Server Infrastructure Deployment',
  '2024',
  '2024',
  'Dhaka, Bangladesh',
  'Academic Project',
  'Under the supervision of Dr. Uzzal Prodhan, Professor, Department of CSE. Designed and deployed a Linux-based server infrastructure using Ubuntu Server.',
  ARRAY[
    'Led project planning, technical implementation, troubleshooting, and documentation activities',
    'Coordinated team members throughout the project and supported effective task execution',
    'Configured core networking services and evaluated server performance in a practical networking environment',
    'Applied practical knowledge of Linux administration, networking, and server deployment in an academic-industry collaborative project'
  ],
  'Research',
  3
),
(
  'Peer Tutor, Study Group Leader & Academic Mentor',
  'Bangladesh University',
  NULL,
  '2021',
  '2024',
  'Dhaka, Bangladesh',
  'Voluntary',
  'Provided academic support to approximately 15-20 undergraduate students and guided university applicants, junior students, and peers on academic planning and career development.',
  ARRAY[
    'Organized group study and discussion sessions, explained difficult concepts, and assisted classmates with problem-solving and examination preparation',
    'Guided junior students and peers on academic planning, study strategies, university admission, higher education, and scholarship opportunities',
    'Provided guidance on career planning, technical skill development, professional certifications, and networking careers',
    'Elected Assistant Class Representative (ACR), facilitating communication between students and faculty'
  ],
  'Research',
  4
),
(
  'Course Representative — Data Structure',
  'Bangladesh University',
  NULL,
  '2022',
  '2022',
  'Dhaka, Bangladesh',
  'Voluntary',
  'Under the guidance of Muhammad Minoar Hossain, 3rd Semester. Acted as a communication link between the course instructor and students.',
  ARRAY[
    'Coordinated course-related announcements, academic updates, and communication among classmates',
    'Assisted students with course-related concerns and helped maintain effective coordination between the instructor and the class'
  ],
  'Research',
  5
),
(
  'Private Tutor',
  'Feni Polytechnic Institute',
  NULL,
  '2014',
  '2016',
  'Feni, Bangladesh',
  'Part Time',
  'Provided private tutoring to approximately 8-10 diploma-level students in Computer Fundamentals, Programming, and Mathematics.',
  ARRAY[
    'Delivered personalized one-to-one and small-group academic support focused on concept development, problem-solving, and examination preparation'
  ],
  'Research',
  6
);

-- ----------------------------------------------------------------------------
-- Publications
-- ----------------------------------------------------------------------------
INSERT INTO publications (title, authors, journal, publication_date, status, category, citations, keywords, abstract, url, display_order)
VALUES
(
  'Distributed Telemedicine Systems in Bangladesh: A Review of AI, Federated Learning, IoMT, Blockchain, and Edge Computing for Secure Rural Healthcare (Probable Title)',
  'Rafat Ara (1st Author), Mohammad Golam Sarowar (2nd Author)',
  NULL,
  NULL,
  'Ongoing',
  'Work in Progress',
  0,
  ARRAY['Telemedicine', 'AI', 'Federated Learning', 'IoMT', 'Blockchain', 'Edge Computing', 'Rural Healthcare', 'Bangladesh'],
  'A comprehensive review of distributed telemedicine systems in Bangladesh, focusing on the integration of AI, Federated Learning, IoMT, Blockchain, and Edge Computing. Investigates security, privacy, accessibility, and technological challenges in distributed healthcare systems, with particular emphasis on rural healthcare, and identifies technology gaps and future research directions for secure and scalable digital healthcare.',
  NULL,
  1
),
(
  'IoT-Based Smart Contract Framework for Rice Supply Chain Traceability Recall System and Consumer Safety',
  'Mohammad Golam Sarowar (Researcher & Co-Author), et al.',
  'International Conference on Technological Intelligence and Business Strategies (TIBS 2026), Manila, Philippines',
  '2026',
  'Accepted for Publication',
  'Conference Publication',
  0,
  ARRAY['IoT', 'Smart Contracts', 'Blockchain', 'Supply Chain', 'Traceability', 'Consumer Safety'],
  'An IoT and smart-contract-based framework for rice supply-chain traceability, product recall, and consumer safety, exploring how IoT and blockchain-based smart contracts improve transparency, traceability, and reliability in the agricultural supply chain. Paper selected for publication in connection with TIBS 2026, subject to fulfilment of Springer publication guidelines.',
  NULL,
  2
);

-- ----------------------------------------------------------------------------
-- Skills — Technical
-- ----------------------------------------------------------------------------
INSERT INTO skills (name, category, proficiency, display_order)
VALUES
('BGP (Border Gateway Protocol)', 'Technical', 'Advanced', 1),
('OSPF', 'Technical', 'Advanced', 2),
('MPLS', 'Technical', 'Advanced', 3),
('IPv4/IPv6 Routing & Switching', 'Technical', 'Advanced', 4),
('Traffic Engineering & Capacity Planning', 'Technical', 'Advanced', 5),
('Cisco IOS / IOS-XR', 'Technical', 'Advanced', 6),
('Junos OS (Juniper)', 'Technical', 'Advanced', 7),
('Huawei VRP', 'Technical', 'Intermediate', 8),
('MikroTik RouterOS / Winbox', 'Technical', 'Advanced', 9),
('Linux Administration (Ubuntu, CentOS)', 'Technical', 'Advanced', 10),
('Network Monitoring (PRTG, Zabbix, Cacti, Wireshark)', 'Technical', 'Advanced', 11),
('Virtualization (VMware, Proxmox)', 'Technical', 'Intermediate', 12),
('Network Security Fundamentals', 'Technical', 'Advanced', 13),
('CDN Integration & Optimization', 'Technical', 'Advanced', 14),
('IoT Fundamentals', 'Technical', 'Intermediate', 15),
('Artificial Intelligence & Machine Learning Fundamentals', 'Technical', 'Intermediate', 16),
('Federated Learning', 'Technical', 'Intermediate', 17),
('Blockchain & Smart Contracts', 'Technical', 'Intermediate', 18),
('Python (Data Analysis)', 'Technical', 'Basic', 19),
('draw.io — System Architecture Diagrams', 'Technical', 'Intermediate', 20),
('SecureCRT / PuTTY Remote Administration', 'Technical', 'Advanced', 21);

-- ----------------------------------------------------------------------------
-- Skills — Interpersonal
-- ----------------------------------------------------------------------------
INSERT INTO skills (name, category, proficiency, display_order)
VALUES
('Team Leadership & Mentoring', 'Interpersonal', 'Advanced', 1),
('Public Speaking & Training Facilitation', 'Interpersonal', 'Advanced', 2),
('Cross-Functional Coordination', 'Interpersonal', 'Advanced', 3),
('Client & Vendor Communication', 'Interpersonal', 'Advanced', 4),
('Technical Documentation & Reporting', 'Interpersonal', 'Advanced', 5),
('Peer Tutoring & Academic Mentoring', 'Interpersonal', 'Advanced', 6),
('Community Engagement & Volunteering Leadership', 'Interpersonal', 'Advanced', 7),
('Academic Writing & Literature Review', 'Interpersonal', 'Intermediate', 8);

-- ----------------------------------------------------------------------------
-- Skills — Languages
-- ----------------------------------------------------------------------------
INSERT INTO skills (name, category, proficiency, display_order)
VALUES
('Bengali', 'Languages', 'Native', 1),
('English', 'Languages', 'Advanced', 2);

-- ----------------------------------------------------------------------------
-- Certifications
-- ----------------------------------------------------------------------------
INSERT INTO certifications (name, issuer, issue_date, credential_url, display_order)
VALUES
('Cisco Certified Network Associate (CCNA) — ID: CSCO14551272', 'Cisco', 'Feb 2024 (valid through Feb 2027)', NULL, 1),
('MikroTik Certified Routing Engineer (MTCRE) — ID: 2401RE4147', 'MikroTik', 'Jan 2024', NULL, 2),
('MikroTik Certified Network Associate (MTCNA) — ID: 2310NA6582', 'MikroTik', 'Oct 2023', NULL, 3),
('ISP/IIG Setup using Cisco (IOS-XR) — Certificate of Attendance', 'Open ICT', 'Jun 2026', NULL, 4),
('ISP/IIG Setup using Juniper — Certificate of Attendance', 'Open ICT', 'Oct 2024', NULL, 5),
('Basic & Advanced Networking Training (3-month practical training)', 'Bijoy Online Limited', '2018', NULL, 6);

-- ----------------------------------------------------------------------------
-- Awards & Honors
-- ----------------------------------------------------------------------------
INSERT INTO awards (title, issuer, date, description, display_order)
VALUES
('Early Career Promotion – Assistant Manager', 'Digi Jadoo Broadband Limited', '2026', 'Recognized with an early promotion to Assistant Manager for outstanding performance, technical expertise, and professional contribution.', 1),
('Best Employee Award', 'Digi Jadoo Broadband Limited', '2025', 'Recognized for outstanding professional performance and contribution to the organization.', 2),
('3rd Highest Academic Result – Final-Year Cohort', 'Department of CSE, Bangladesh University', '2024', 'Ranked 3rd in academic performance among the final-year students in the Department of Computer Science and Engineering.', 3),
('Highest CGPA Recognition – 5th Semester', 'Bangladesh University', '2022', 'Recognized for achieving the highest academic performance in the 5th semester of the undergraduate program.', 4),
('Merit Scholarship, Diploma in Engineering', 'Feni Polytechnic Institute', '2012–2016', 'Received a merit-based scholarship in recognition of academic performance.', 5),
('Best Performer – Networking Training', 'Bijoy Online Limited', '2018', 'Achieved the highest score in the final training assessment among 7 participants.', 6),
('Academic Merit – 2nd Position, Dakhil Examination', 'Hazrat Shah Sufi Main Uddin Shah (R.) Dakhil Madrasah', '2012', 'Achieved 2nd position based on academic performance among the 2012 batch at the institution.', 7);

-- ----------------------------------------------------------------------------
-- Volunteering
-- ----------------------------------------------------------------------------
INSERT INTO volunteering (role, organization, start_date, end_date, description, display_order)
VALUES
('Volunteer Member', 'Bangladesh Red Crescent Society (Red Crescent Youth – RCY)', '2021', 'Present', 'Participated in community service, educational support, and social welfare activities through the Bangladesh Red Crescent Youth (RCY), developing experience in teamwork, communication, and social engagement.', 1),
('Community Volunteer – Blood Donation Activities', 'Bangladesh Red Crescent / Community Initiatives', '2018', 'Present', 'Participated in voluntary blood donation initiatives and supported emergency blood-donor coordination, contributing to community awareness on voluntary blood donation.', 2),
('Educational Volunteer & Peer Support', 'Bangladesh University', '2021', '2024', 'Supported junior students and peers with academic guidance, programming and networking-related assistance, and shared information on higher education, scholarship opportunities, and professional development.', 3);

-- ----------------------------------------------------------------------------
-- Scholarly Activities
-- ----------------------------------------------------------------------------
INSERT INTO scholarly_activities (title, type, organization, date, description, display_order)
VALUES
(
  'Paper Presentation: IoT-Based Smart Contract Framework for Rice Supply Chain Traceability',
  'Conference Presentation',
  'TIBS 2026, Manila, Philippines (Online)',
  '2026',
  'Presented the co-authored research paper at TIBS 2026 through an online conference presentation, discussing an IoT- and smart-contract-based framework for improving supply-chain traceability, product recall, data integrity, and consumer safety.',
  1
),
(
  '15-Day Intensive Workshop: Targeting Prestigious Erasmus Mundus Scholarship',
  'Workshop',
  'ABCD Laboratory, Bangladesh (under the guidance of Md. Junaid, Founder & Principal Investigator)',
  '2026',
  'Participated in an intensive workshop focused on Erasmus Mundus scholarship preparation, higher-study planning, and academic profile development.',
  2
),
(
  'Aspire Leaders Program – Cohort 3',
  'Leadership Program',
  'Aspire Institute',
  'Jul 2026 – Present',
  'Selected participant in an 8-week global leadership development program focused on leadership, communication, career readiness, mentorship, and global peer networking.',
  3
),
(
  '64th Bangladesh International Education Expo 2026',
  'Conference / Expo Participation',
  'International Convention City Bashundhara (ICCB), Dhaka',
  '23-25 Jul 2026',
  'Participated in an international education event focused on higher education opportunities, scholarships, and international university programs, exploring study-abroad and international academic collaboration pathways.',
  4
),
(
  'Academic Presentations – Undergraduate Studies',
  'Academic Presentation',
  'Bangladesh University',
  '2021-2024',
  'Delivered individual and group academic presentations on technical and course-related topics as part of undergraduate CSE coursework.',
  5
);
