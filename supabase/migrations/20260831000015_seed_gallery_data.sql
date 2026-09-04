-- Seed data for the Gallery timeline (gallery_items table).
-- Requires 20260831000014_create_gallery.sql to have been applied first.
-- Real photos are not yet available, so `image` is left NULL for every row — the
-- Gallery UI already falls back to a clean camera-icon placeholder in that case.
-- Entries are ordered chronologically via display_order so the timeline reads as a
-- coherent "journey" story, oldest milestone first.

INSERT INTO gallery_items (title, summary, story, event_date, location, external_link, display_order)
VALUES
(
  'Where It Began: Teaching While Learning',
  'Long before managing core networks, I was in front of a whiteboard — tutoring diploma students in programming, computer fundamentals, and mathematics.',
  'During my own diploma years at Feni Polytechnic Institute, I began privately tutoring 8–10 fellow students in Computer Fundamentals, Programming, and Mathematics. Explaining concepts to others taught me as much as any classroom did, and it planted the seed for the mentoring I still do today.',
  '2014 – 2016',
  'Feni, Bangladesh',
  NULL,
  1
),
(
  'Building a Campus Community of Learners',
  'From study-group leader to elected Assistant Class Representative — supporting 15–20 students through coursework, admissions, and career decisions.',
  'At Bangladesh University I organized group study sessions, helped classmates prepare for exams, and guided juniors on academic planning, scholarships, and networking careers. I was later elected Assistant Class Representative, bridging communication between students and faculty, and also served as Course Representative for Data Structure.',
  '2021 – 2024',
  'Dhaka, Bangladesh',
  NULL,
  2
),
(
  'Cutting My Teeth on a Live ISP Network',
  'As Senior Engineer at Link3 Technologies, I kept a real ISP backbone alive — BGP, OSPF, VLANs, and round-the-clock troubleshooting across Cisco, Juniper, Huawei, and MikroTik gear.',
  'This role was where theory met the pressure of a live network. Configuring and troubleshooting BGP, OSPF, VLANs, PPPoE, and IPv4/IPv6 routing across multi-vendor hardware, coordinating with NOC teams and upstream providers, and keeping documentation current — it was demanding, hands-on training that shaped how I approach network reliability today.',
  'March 2022 – June 2023',
  'Dhaka, Bangladesh',
  NULL,
  3
),
(
  'Leading a Linux Infrastructure Project',
  'Appointed Project Leader for an academic-industry collaboration to design and deploy an Ubuntu Server-based enterprise infrastructure.',
  'Under the supervision of Dr. Uzzal Prodhan, Professor of CSE, I led project planning, technical implementation, and documentation for a Linux-based server infrastructure deployment. Coordinating a team, configuring core networking services, and evaluating performance in a practical environment gave me a first real taste of technical leadership.',
  '2024',
  'Dhaka, Bangladesh',
  NULL,
  4
),
(
  'Stepping Up: Assistant Manager, Core IP Network',
  'Promoted to lead Core IP Network operations at Digi Jadoo Broadband Ltd., driving BGP traffic engineering, CDN integration, and IPv6 deployment as Team Leader.',
  'In this role I manage and optimize core IP network infrastructure for availability, scalability, and performance — configuring BGP, OSPF, MPLS, and IPv4/IPv6 across the ISP backbone. As Team Leader of Network Operations, I supervise day-to-day NOC activities, guide the team through critical incidents, and coordinate with clients, vendors, and upstream partners on Core Network Expansion, CDN Optimization, and Backbone Upgrade projects.',
  'July 2023 – Present',
  'Dhaka, Bangladesh',
  NULL,
  5
),
(
  'Turning to Research: Telemedicine for Rural Healthcare',
  'Joined as Research Coordinator on a review of AI, Federated Learning, IoMT, Blockchain, and Edge Computing for secure rural telemedicine in Bangladesh.',
  'Working as 2nd Author under the supervision of Rafat Ara, Assistant Professor & PhD Researcher at UITS, I help coordinate the literature review, technical discussions, and outcome preparation for a paper examining how distributed technologies can make rural healthcare more secure, accessible, and scalable.',
  '2026 – Present',
  'Remote / Bangladesh',
  NULL,
  6
),
(
  'Presenting on the World Stage: TIBS 2026, Manila',
  'Presented an IoT and smart-contract-based framework for rice supply-chain traceability at the International Conference on Technological Intelligence and Business Strategies.',
  'Our paper explored how IoT sensors and blockchain-based smart contracts can improve transparency, traceability, and consumer safety in agricultural supply chains — from farm to table. Presenting it online to an international audience at TIBS 2026 was a milestone moment, with the paper selected for publication subject to Springer''s publication guidelines.',
  '2026',
  'Manila, Philippines (Online Presentation)',
  NULL,
  7
);
