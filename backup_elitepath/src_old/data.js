const activitiesData = [
    {
        id: "rsi-mit",
        name: "Research Science Institute (RSI)",
        category: "STEM",
        tier: "Legendary",
        acceptance_rate: "3%",
        description: "The gold standard of high school research. Hosted at MIT, it's widely considered the most prestigious STEM program in the world for high schoolers.",
        history: [
            "Founded in 1984 by the Center for Excellence in Education (CEE), RSI was designed to identify the most promising young scientists in America and give them hands-on research experience at a world-class institution.",
            "Hosted annually at MIT's campus in Cambridge, Massachusetts, RSI brings together approximately 80 students from across the United States and around the world each summer for six weeks of intensive research.",
            "Alumni of RSI include Nobel laureates, Fields Medalists, Turing Award winners, and founders of billion-dollar companies. The program has a documented impact on college admissions: RSI alumni are accepted to MIT, Harvard, and Stanford at extraordinary rates, routinely exceeding 70%.",
            "The program is entirely free of charge for admitted students, including housing and meals, funded through private endowments and corporate sponsorships from institutions like Lockheed Martin and the DoD."
        ],
        insider_info: "Getting into RSI is statistically harder than getting into Harvard. Alumni have a 70%+ acceptance rate to Ivy+ schools.",
        success_profiles: [
            {
                name: "Profile #8291",
                outcome: "Accepted: Harvard, Stanford, MIT",
                stats: "ISEF Finalist, 1580 SAT, USACO Gold",
                quote: "The mentorship at RSI was the differentiating factor for my college apps."
            },
            {
                name: "Profile #1102",
                outcome: "Accepted: Princeton, Caltech",
                stats: "AIME Qualifier, Published in JOSH, Science Bowl Captain",
                quote: "Don't just have grades. You need a narrative. RSI gave me that."
            }
        ],
        roadmap: [
            {
                phase: "Freshman Year",
                task: "Master Python/R and cold-email local professors for lab assistant roles.",
                status: "todo"
            },
            {
                phase: "Sophomore Summer",
                task: "Secure a structured research internship (e.g., BU RISE, COSMOS) to build a track record.",
                status: "todo"
            },
            {
                phase: "Junior Fall",
                task: "Submit preliminary research to regional science fairs to prove capability.",
                status: "todo"
            },
            {
                phase: "App Season (Jan)",
                task: "Craft essays focusing on 'Scientific Curiosity' rather than just technical achievements.",
                status: "todo"
            }
        ]
    },
    {
        id: "isef",
        name: "Regeneron ISEF",
        category: "STEM",
        tier: "Legendary",
        acceptance_rate: "Top 0.1% of Fairs",
        description: "The Olympics of Science Fairs. Winning here basically guarantees admission to a T20 university.",
        history: [
            "The International Science and Engineering Fair (ISEF) was founded by Science Service (now Society for Science) in 1950. What began as a small national competition has grown into the world's largest international pre-college science competition, hosting over 1,800 finalists each year from 75+ countries.",
            "Regeneron has been the title sponsor since 2017, contributing millions in prize money annually. Top prizes include the $75,000 Gordon E. Moore Award. Past finalists have gone on to win Nobel Prizes and launch globally significant scientific careers.",
            "ISEF operates through a network of hundreds of affiliated regional and state science fairs. Students must first win at their local fair to qualify, making national recognition a multi-year journey of escalating competition."
        ],
        insider_info: "Judges look for novelty and methodology over complex equipment. You can win with a laptop and public datasets if the analysis is brilliant.",
        success_profiles: [
            {
                name: "Profile #3321",
                outcome: "Accepted: MIT, Yale",
                stats: "ISEF Category Winner, 3 Patents, 4.0 UW GPA",
                quote: "I spent 6 months just refining my problem statement."
            }
        ],
        roadmap: [
            {
                phase: "Ideation",
                task: "Read the last 3 years of winning abstracts in your category to find gaps.",
                status: "todo"
            },
            {
                phase: "Execution",
                task: "Log every single day in a physical lab notebook. Judges love this.",
                status: "todo"
            },
            {
                phase: "Regionals",
                task: "Present to non-experts. If your grandma doesn't understand it, you won't win.",
                status: "todo"
            }
        ]
    },
    {
        id: "nsda-nats",
        name: "NSDA Nationals (Debate)",
        category: "Humanities",
        tier: "National",
        acceptance_rate: "Top 1% of Debaters",
        description: "The largest academic competition in the world. National finalists are heavily recruited by top political science and econ programs.",
        history: [
            "The National Speech & Debate Association (NSDA), formerly the National Forensic League, was founded in 1925 and is the oldest and largest academic organization in high school history. It currently has over 150,000 active student members across more than 4,000 schools.",
            "The National Championship tournament rotates cities each year, drawing over 4,000 competitors who qualified through regional circuit competitions. Formats range from Lincoln-Douglas philosophy debates to Policy (CX) to Public Forum, each with its own distinct competitive ecosystem.",
            "Alumni of competitive debate programs have gone on to become senators, Supreme Court justices, CEOs, and Pulitzer Prize winners. Georgetown, Yale, and Northwestern are among the universities that actively recruit top debaters."
        ],
        insider_info: "Consistency matters more than one big win. The 'Code of Points' is tracked by recruiters.",
        success_profiles: [
            {
                name: "Profile #992",
                outcome: "Accepted: Yale (PolSci), UChicago",
                stats: "NSDA National Finalist, TOC Qualifier, Student Body President",
                quote: "Debate taught me how to think, not just what to think."
            }
        ],
        roadmap: [
            {
                phase: "Novice Year",
                task: "Go to camp. UTNIF or NSD are the standard for serious competitors.",
                status: "todo"
            },
            {
                phase: "The Grind",
                task: "Cut cards for at least 3 hours a week. Information conceptualization is key.",
                status: "todo"
            },
            {
                phase: "Quals",
                task: "Focus on 'Lay appeal'. You need to win over parent judges to get to Nationals.",
                status: "todo"
            }
        ]
    },
    {
        id: "tasp-simulation",
        name: "Telluride Association (TASP legacy)",
        category: "Humanities",
        tier: "Legendary",
        acceptance_rate: "Historically < 5%",
        description: "(Note: TASP has reorganized, but this represents the 'Intellectual Bootcamp' archetype). The holy grail for humanities majors.",
        history: [
            "The Telluride Association Summer Program (TASP) was established by the Telluride Association, a non-profit founded in 1911 from a bequest of Colorado mining magnate Lucien Nunn. Its mission was to support unconventional, intellectually radical education for exceptional young people.",
            "For decades, TASP was considered one of the most exclusive and intellectually rigorous summer programs in the world. The six-week seminars were held at Cornell and Michigan, and students governed themselves democratically with no adult supervision. Tuition was fully funded.",
            "The program attracted a fierce cult following in elite humanities circles. Its alumni include prominent academics, published authors, and philosophers. After the COVID-19 pandemic, the program underwent significant restructuring, but the archetype it pioneered — intense, student-governed intellectual discourse — remains the benchmark for humanistic summer programs."
        ],
        insider_info: "Essays are everything. They want raw, unchecked intellectual vitality, not polished resume-speak.",
        success_profiles: [
            {
                name: "Profile #12",
                outcome: "Accepted: Harvard, Columbia, Oxford",
                stats: "Published Novelist, History Bowl Captain",
                quote: "They asked me about the color blue for 30 minutes in the interview."
            }
        ],
        roadmap: [
            {
                phase: "Reading",
                task: "Read critical theory. Foucault, Derrida, Butler. Reference them naturally.",
                status: "todo"
            },
            {
                phase: "Writing",
                task: "Practice writing 500 words a day on abstract concepts.",
                status: "todo"
            }
        ]
    },
    {
        id: "usaco",
        name: "USA Computing Olympiad (USACO)",
        category: "STEM",
        tier: "National",
        acceptance_rate: "Platinum is Top ~300 students",
        description: "The main pipeline for algorithmic programmers. Reaching Platinum division is a massive signal for CS admissions.",
        history: [
            "The USA Computing Olympiad was launched in 1993 and has been administered by a rotating group of college students and coaches ever since. It operates entirely online, making it uniquely accessible while remaining extraordinarily competitive.",
            "USACO uses a tiered division system (Bronze → Silver → Gold → Platinum), and students advance by earning sufficient scores in quarterly contests held throughout the academic year. Only a few hundred students nationally achieve Platinum standing.",
            "Top USACO performers are recruited for the US International Olympiad in Informatics (IOI) team, representing the USA on the world stage. The competition has directly shaped the careers of engineers at Google, Facebook, and major research institutions — CMU's School of Computer Science actively tracks USACO standings."
        ],
        insider_info: "Don't just memorize algorithms. Problems are getting more ad-hoc.",
        success_profiles: [
            {
                name: "Profile #404",
                outcome: "Accepted: CMU SCS, MIT",
                stats: "USACO Platinum, Codeforces Candidate Master",
                quote: "I did every past problem from 2015 onwards."
            }
        ],
        roadmap: [
            {
                phase: "Bronze/Silver",
                task: "Master basic arrays, sorting, and greedy algorithms. usage of C++ is recommended over Java.",
                status: "todo"
            },
            {
                phase: "Gold",
                task: "Dynamic Programming and Graph Theory (BFS/DFS/Dijkstra) are non-negotiable.",
                status: "todo"
            },
            {
                phase: "Platinum Push",
                task: "Segment Trees and Advanced Data Structures. Practice on Codeforces Div 2/1.",
                status: "todo"
            }
        ]
    },
    {
        id: "scholastic-art",
        name: "Scholastic Art & Writing",
        category: "Arts",
        tier: "National",
        acceptance_rate: "Gold Key < 5%",
        description: "The longest-running recognition program for creative teens. A Gold Medal Portfolio is a huge hook for art schools and universities alike.",
        history: [
            "The Scholastic Art & Writing Awards were founded in 1923, making them the longest-running, most prestigious recognition program for creative teens in the United States. What began as a writing contest in a single magazine has grown into a program that receives over 350,000 submissions annually.",
            "The program is administered by the Alliance for Young Artists & Writers, a nonprofit. Submissions are judged regionally by professional artists and educators, with top pieces advancing to national review in New York City.",
            "Notable alumni include Andy Warhol, Truman Capote, Sylvia Plath, Joyce Carol Oates, and dozens of Academy Award, Grammy, and Pulitzer Prize winners. Gold Medal and American Voices nominees receive significant scholarship money and are often featured in exhibitions at major institutions like Carnegie Hall."
        ],
        insider_info: "Originality scores highest. Technical skill is expected, but 'Voice' wins medals.",
        success_profiles: [
            {
                name: "Profile #77",
                outcome: "Accepted: RISD, Brown (Dual Degree)",
                stats: "National Gold Medal Portfolio, YoungArts Finalist",
                quote: "I took risks with my medium. Don't be safe."
            }
        ],
        roadmap: [
            {
                phase: "Concept",
                task: "Develop a cohesive theme for your portfolio early in Junior year.",
                status: "todo"
            },
            {
                phase: "Selection",
                task: "Curate ruthlessly. 8 strong pieces are better than 8 strong + 4 weak.",
                status: "todo"
            }
        ]
    },
    {
        id: "usamo",
        name: "USA Math Olympiad (USAMO)",
        category: "STEM",
        tier: "Legendary",
        acceptance_rate: "Top ~250 Students in USA",
        description: "The pinnacle of high school mathematics. Qualifying for USAMO is a virtual guarantee of admission to top STEM programs.",
        history: [
            "The USA Mathematical Olympiad was first held in 1972, developed to identify the strongest math students in the country for the International Mathematical Olympiad (IMO). It is administered by the Mathematical Association of America (MAA).",
            "The qualification pathway is rigorous: students must first excel on the AMC 10/12, then the AIME, before reaching USAMO. Only approximately 250 students nationally qualify each year — out of hundreds of thousands who attempt the AMC.",
            "USAMO qualifiers are invited to the Mathematical Olympiad Program (MOP) at Carnegie Mellon, with the top performers selected for the 6-person US IMO team. The US team has won the international competition multiple times. USAMO and AIME scores are actively sought by MIT, Harvard, Princeton, and Caltech admissions offices."
        ],
        insider_info: "A MOP (Math Olympiad Program) invitation is the golden ticket. Just qualifying for USAMO is huge, but MOP is legendary.",
        success_profiles: [
            {
                name: "Profile #314",
                outcome: "Accepted: MIT, Princeton, Stanford",
                stats: "USAMO Qualifier (2x), MOP Invitee",
                quote: "I stopped doing homework to solve AIME problems. Worth it."
            }
        ],
        roadmap: [
            {
                phase: "AMC 10/12",
                task: "Consistently score 120+. Speed and accuracy on the first 15 questions is key.",
                status: "todo"
            },
            {
                phase: "AIME",
                task: "Practice solving 10-12 questions in 3 hours. Focus on Number Theory and Geometry.",
                status: "todo"
            },
            {
                phase: "Proof Writing",
                task: "USAMO is all proofs. Read 'Euclidean Geometry in Mathematical Olympiads'.",
                status: "todo"
            }
        ]
    },
    {
        id: "deca-icdc",
        name: "DECA ICDC",
        category: "Leadership",
        tier: "National",
        acceptance_rate: "Top ~15% of Competitors",
        description: "The premier business competition. Winning 'Glass' (a trophy) at ICDC proves you have executive potential.",
        history: [
            "DECA was founded in 1946 as the Distributive Education Clubs of America, designed to prepare high school students for careers in marketing, finance, hospitality, and management. Today it has over 230,000 members in over 3,500 schools across the US and in 10 countries.",
            "The International Career Development Conference (ICDC) is DECA's flagship annual competition, drawing over 20,000 students each spring to compete in individual, team, and chapter events spanning multiple business disciplines.",
            "Winning a DECA ICDC event, particularly in competitive categories like Finance, Marketing, or Entrepreneurship, is a recognized credential in business school admissions. Programs at Wharton (UPenn), Ross (Michigan), and Kelley (Indiana) have noted ICDC placement as a meaningful differentiator."
        ],
        insider_info: "The role-play is 70% confidence. You can know less content but win on presentation.",
        success_profiles: [
            {
                name: "Profile #500",
                outcome: "Accepted: Wharton (UPenn), Dyson (Cornell)",
                stats: "ICDC 1st Place Marketing, 3-Year State Officer",
                quote: "I treated the judge like a client, not a teacher."
            }
        ],
        roadmap: [
            {
                phase: "Test Taking",
                task: "Memorize the glossary. The written exam separates the good from the great.",
                status: "todo"
            },
            {
                phase: "Role Play",
                task: "Practice with a stopwatch. You must hit all performance indicators.",
                status: "todo"
            }
        ]
    },
    {
        id: "hosa-ilc",
        name: "HOSA ILC",
        category: "STEM",
        tier: "National",
        acceptance_rate: "Top 10% of Members",
        description: "The standard for future health professionals. Placing at the International Leadership Conference (ILC) is huge for BS/MD programs.",
        history: [
            "HOSA – Future Health Professionals was established in 1976 as a co-curricular student organization for health science education students. It now has over 300,000 members in all 50 US states, Puerto Rico, and several international chapters.",
            "The International Leadership Conference (ILC) is HOSA's annual competitive event, spanning over 65 distinct healthcare events from medical terminology and pharmacology to emergency nursing and biomedical lab science.",
            "Medical schools and BS/MD programs look favorably on HOSA ILC placement because it demonstrates both academic rigor (written exams) and hands-on clinical skill (practical rounds). Brown PLME, Northwestern HPME, and Rice/Baylor have alumni who credit HOSA as a key part of their application narrative."
        ],
        insider_info: "Choose a niche event. 'Medical Spelling' is less competitive than 'CPR/First Aid'.",
        success_profiles: [
            {
                name: "Profile #911",
                outcome: "Accepted: Brown PLME, Rice/Baylor",
                stats: "HOSA ILC Gold Medalist, 500+ Hospital Volunteer Hours",
                quote: "My event aligned perfectly with my shadowing experience."
            }
        ],
        roadmap: [
            {
                phase: "Event Selection",
                task: "Pick an event that requires a skill you already have or want to learn deeply.",
                status: "todo"
            },
            {
                phase: "State",
                task: "Dominate the written test. It's the gatekeeper to the practical rounds.",
                status: "todo"
            }
        ]
    },
    {
        id: "frc-worlds",
        name: "FIRST Robotics (Worlds)",
        category: "STEM",
        tier: "National",
        acceptance_rate: "Top Teams Global",
        description: "Reviewers love 'Dean's List' finalists. It shows technical skill + leadership.",
        history: [
            "FIRST (For Inspiration and Recognition of Science and Technology) was founded by inventor Dean Kamen in 1989. The FIRST Robotics Competition (FRC) launched in 1992 with 28 teams; today it has over 4,000 teams in 30 countries competing at the annual World Championship in Houston.",
            "Each January, a new game is announced and teams have exactly six weeks to design, build, program, and test a robot to compete. The compressed timeline is intentional — it mirrors real engineering constraints and builds team problem-solving under pressure.",
            "Beyond robotics, FIRST emphasizes 'Gracious Professionalism,' a culture of collaboration even in competition. The Dean's List Finalist award specifically honors students who exemplify this ethos through leadership and community impact. Top universities like MIT, Olin, and Carnegie Mellon actively partner with FIRST and recruit its alumni."
        ],
        insider_info: "Being a 'builder' is good. Being the 'Lead Programmer' or 'Team Captain' of a Worlds team is better.",
        success_profiles: [
            {
                name: "Profile #010",
                outcome: "Accepted: Olin, MIT, CMU",
                stats: "Dean's List Finalist, Lead CAD Designer",
                quote: "I wrote the grant that funded our travel to Houston."
            }
        ],
        roadmap: [
            {
                phase: "The Season",
                task: "Don't just build. Document everything in the Engineering Notebook.",
                status: "todo"
            },
            {
                phase: "Impact",
                task: "Mentor a First Lego League (FLL) team. Outreach is scored heavily.",
                status: "todo"
            }
        ]
    },
    {
        id: "youngarts",
        name: "YoungArts",
        category: "Arts",
        tier: "Legendary",
        acceptance_rate: "~700 Winners / 7000+ Apps",
        description: "The sole path to becoming a Presidential Scholar in the Arts. Highly prestigious for any creative field.",
        history: [
            "YoungArts was founded in Miami in 1981 by Lin and Ted Arison with a mission to identify and support the most talented emerging artists in the United States. Since its founding, it has provided over $7 million in cash awards and has supported more than 20,000 alumni.",
            "The program recognizes students in 10 disciplines: Dance, Jazz, Music, Classical, Photography, Theater, Visual Arts, Voice, Writing, and Film. Winners are invited to an all-expenses-paid National Arts Week in Miami for masterclasses with world-class mentors.",
            "YoungArts is the exclusive pathway to nomination as a Presidential Scholar in the Arts — one of the highest honors the US government bestows on high school students. Alumni include Viola Davis, Nicki Minaj, Timothée Chalamet, and Desmond Richardson. Juilliard, NYU Tisch, and Columbia actively seek YoungArts finalists."
        ],
        insider_info: "They want 'artist's potential', not just technical perfection. Be bold.",
        success_profiles: [
            {
                name: "Profile #88",
                outcome: "Accepted: Juilliard, Columbia",
                stats: "YoungArts Finalist (Jazz Bass), Grammy Band",
                quote: "The week in Miami changed my life and my network."
            }
        ],
        roadmap: [
            {
                phase: "Videography",
                task: "Your audition tape audio quality must be professional. No iPhone mics.",
                status: "todo"
            },
            {
                phase: "Repertoire",
                task: "Choose pieces that show contrasting styles. Classical + experimental.",
                status: "todo"
            }
        ]
    },
    {
        id: "physics-olympiad",
        name: "US Physics Olympiad (USAPhO)",
        category: "STEM",
        tier: "Legendary",
        acceptance_rate: "Top 400 Students",
        description: "Extremely rigorous. Gold medalists often go to Caltech or MIT.",
        history: [
            "The US Physics Olympiad program was established in 1986, modeled after the International Physics Olympiad (IPhO) which began in Eastern Europe in 1967. It is administered by the American Association of Physics Teachers (AAPT) and the American Institute of Physics (AIP).",
            "The qualification ladder begins with the F=ma exam, a 25-question multiple choice test of mechanics held each January. Top scorers (~400 students) advance to the USAPhO semifinal and then an invitational physics camp at the University of Maryland, where the 5-member US IPhO team is selected.",
            "The United States has consistently ranked among the top nations at IPhO, with US team members often winning gold and silver medals. USAPhO participation is a strong signal for Caltech, MIT, and Harvey Mudd College in particular, as it demonstrates both deep conceptual understanding and mathematical maturity rarely achievable in standard high school curricula."
        ],
        insider_info: "F=ma exam speed is critical. You need to be fast to qualify for the semi-final.",
        success_profiles: [
            {
                name: "Profile #E=mc2",
                outcome: "Accepted: Caltech, Harvey Mudd",
                stats: "USAPhO Gold, Research at Local Lab",
                quote: "Halliday and Resnick is your bible. Read it twice."
            }
        ],
        roadmap: [
            {
                phase: "F=ma",
                task: "Practice past exams under timed conditions. 25 questions, 75 minutes.",
                status: "todo"
            },
            {
                phase: "Top 20 Training",
                task: "Camp qualifiers basically live and breathe physics. Study 20+ hours/week.",
                status: "todo"
            }
        ]
    },
    {
        id: "model-un-gavel",
        name: "Model UN (Best Delegate)",
        category: "Leadership",
        tier: "National",
        acceptance_rate: "Top 1-2 per committee",
        description: "Getting the 'Gavel' (Best Delegate) at a major conference like HMUN or NAIMUN is a strong leadership signal.",
        history: [
            "Model United Nations has its roots in the League of Nations simulations run at American universities in the 1920s. The first modern MUN conference is generally traced to Harvard (HMUN), founded in 1927. Today, thousands of MUN conferences are held annually across the world at the high school and college level.",
            "Prestigious national and international conferences like HMUN (Harvard), NAIMUN (Georgetown), BMUN (Berkeley), and NMUN (National) attract delegations from hundreds of schools and are highly competitive. The 'Gavel' or 'Best Delegate' award is given to the top 1-2 students in each committee of 20-30 delegates.",
            "MUN alumni have gone on to careers in diplomacy, law, international business, and government. Georgetown School of Foreign Service, Yale, and Columbia SIPA routinely report high rates of MUN experience among admitted students. Beyond academics, MUN builds negotiation, public speaking, and coalition-building skills valued in nearly every professional field."
        ],
        insider_info: "Resolution writing is where you control the room. Be the main author.",
        success_profiles: [
            {
                name: "Profile #UN",
                outcome: "Accepted: Georgetown SFS, Yale",
                stats: "Best Delegate at HMUN, Secretary General",
                quote: "Unmoderated caucus is where you win the award."
            }
        ],
        roadmap: [
            {
                phase: "Research",
                task: "Know your country's policy better than the actual ambassador.",
                status: "todo"
            },
            {
                phase: "Speaking",
                task: "Practice impromptu speeches. You need to pivot instantly.",
                status: "todo"
            }
        ]
    },
    {
        id: "nonprofit-founder",
        name: "Non-Profit Founder (Scaled)",
        category: "Leadership",
        tier: "National",
        acceptance_rate: "N/A (Impact Dependent)",
        description: "Anyone can start one. Few scale it. Raising $10k+ or impacting 1000+ people is the benchmark.",
        history: [
            "Student-led non-profits have become an increasingly prominent feature of elite college applications over the past two decades, driven by a shift in admissions philosophy toward 'impact' and 'initiative' rather than mere participation. Stanford and MIT in particular have signaled they seek students who 'change the world around them.'",
            "The bar has risen significantly. Admissions readers are now trained to distinguish between impactful non-profits and performative ones. Organizations that have achieved 501(c)(3) status, formed partnerships with established institutions, or demonstrated measurable community impact carry far more weight than those limited to social media presence.",
            "Successful student-founder profiles typically show a clear problem-to-solution arc, sustained operation over multiple years, and documented outcomes. Fundraising totals, number of people served, and organizational growth (chapters, volunteers) are the key metrics that resonate with admissions committees at Stanford, Duke, and Penn."
        ],
        insider_info: "Don't just do a bake sale. Solve a unique local problem.",
        success_profiles: [
            {
                name: "Profile #CEO",
                outcome: "Accepted: Stanford, Duke",
                stats: "Founder of 'Code for Kids', $15k Raised, 5 Chapters",
                quote: "Partnerships with existing orgs helped us scale 10x faster."
            }
        ],
        roadmap: [
            { phase: "Year 1: Intellectual Curiosity", action: "Read widely outside the school curriculum. Focus on critical theory, philosophy, or sociology. Start a blog or discussion group to practice articulating complex abstract ideas." },
            { phase: "Year 2: Community Leadership", action: "Launch a community initiative that addresses a systemic issue. It’s not about volume (hours), it’s about depth and unique insight. Document your impact qualitatively." },
            { phase: "Year 3: The Essays", action: "The TASP essays are famously rigorous. Avoid clichés. Write about intellectual risks you've taken. Show, do not just tell, your capacity for seminar-style learning." }
        ]
    },
    {
        id: "mit-think",
        name: "MIT THINK Scholar",
        category: "STEM",
        tier: "Legendary",
        acceptance_rate: "~6 Winners",
        description: "A research competition where you propose a project, and MIT funds you to build it.",
        history: [
            "MIT THINK Scholars Program was founded by MIT students as a way to identify and fund exceptionally creative high school researchers who lack institutional support. Unlike RSI or ISEF, THINK does not require prior research experience — it funds new ideas.",
            "Each year, a small cohort of finalists (typically ~6) are selected from hundreds of applications to receive funding, mentorship from MIT students and faculty, and access to MIT's labs. Semi-finalists receive feedback and recognition even without full funding.",
            "The program is notable for its emphasis on the 'maker' ethos: proposals that blend theoretical ambition with practical prototyping are strongly favored. THINK Scholars have built everything from low-cost medical devices for rural communities to novel machine learning tools, and multiple alumni have published findings in peer-reviewed journals directly from their THINK projects."
        ],
        insider_info: "They value feasibility and engineering grit over pure theory.",
        success_profiles: [
            {
                name: "Profile #Thinker",
                outcome: "Accepted: MIT (Early Action)",
                stats: "THINK Scholar, Maker Portfolio",
                quote: "My prototype was ugly, but it worked. That's what they wanted."
            }
        ],
        roadmap: [
            {
                phase: "Proposal",
                task: "Write a clear technical proposal. Include budget and timeline.",
                status: "todo"
            },
            {
                phase: "Build",
                task: "If selected, you have a few months to build. Weekly calls with MIT mentors.",
                status: "todo"
            }
        ]
    },
    {
        id: "google-science-fair",
        name: "Google Science Fair",
        category: "STEM",
        tier: "Legendary",
        acceptance_rate: "Global Top 20",
        description: "Huge global visibility. Focuses on 'Changing the World' through science.",
        history: [
            "The Google Science Fair was launched in 2011 as a global online science competition open to students aged 13–18 from around the world, in partnership with Google, LEGO, National Geographic, Scientific American, and Virgin Galactic. It was designed to democratize access to prestigious science recognition beyond geography.",
            "At its peak, the competition received over 10,000 entries from 90+ countries annually. Winners received scholarships ($50,000 for the grand prize), trips to Google HQ, and mentorship from top scientists and engineers. Several winning projects were subsequently published or commercialized.",
            "The competition placed particular emphasis on projects addressing real-world global challenges — climate change, food security, access to clean water, and healthcare. This social-impact framing distinguished it from pure-science competitions like ISEF, attracting a broader range of interdisciplinary projects. While the competition has since concluded, its model and alumni community continue to influence how universities assess student research potential."
        ],
        insider_info: "Projects with a social impact angle (environment, health, access) tend to do well.",
        success_profiles: [
            {
                name: "Profile #Googler",
                outcome: "Accepted: Stanford, Harvard",
                stats: "Global Finalist, TEDx Speaker",
                quote: "I used ML to solve a problem in my grandmother's garden."
            }
        ],
        roadmap: [
            {
                phase: "The Question",
                task: "Find a problem that affects millions of people.",
                status: "todo"
            },
            {
                phase: "Presentation",
                task: "The video submission is key. Storytelling matters as much as the data.",
                status: "todo"
            }
        ]
    }
];

// Procedural Generation for "Local" and "Regional" Tiers
const roles = ["Volunteer", "Intern", "Shadowing", "Youth Board Member", "Assistant", "Organizer", "Tutor", "Fundraiser", "Captain"];
const locations = ["Local Hospital", "City Council", "Animal Shelter", "Public Library", "Community Garden", "Start-up Incubator", "University Lab", "Food Bank", "Red Cross Chapter"];
const subjects = ["Biology", "Computer Science", "Political Science", "Creative Writing", "Marketing", "Data Analysis", "Graphic Design", "Environmental Science", "Public Health"];

function generateActivities(count) {
    const generated = [];
    for (let i = 0; i < count; i++) {
        const role = roles[Math.floor(Math.random() * roles.length)];
        const loc = locations[Math.floor(Math.random() * locations.length)];
        const subj = subjects[Math.floor(Math.random() * subjects.length)];

        // Randomize Tier (Mostly Local, some Regional)
        const isRegional = Math.random() > 0.8;
        const tier = isRegional ? "Regional" : "Local";

        generated.push({
            id: `gen-${i}`,
            name: `${role} at ${loc} (${subj})`,
            category: mapSubjectToCategory(subj),
            tier: tier,
            acceptance_rate: isRegional ? "Competitive (~20%)" : "Open to All",
            description: `A ${tier.toLowerCase()} opportunity to gain experience in ${subj}. Great for showing sustained commitment over time.`,
            insider_info: isRegional ? "Treat the interview seriously. Dress well." : "Consistency is key. 50 hours > 10 hours.",
            success_profiles: [], // Generated items don't have specific profiles
            roadmap: [
                {
                    phase: "Getting Started",
                    task: "Reach out via email or apply on their website. Have a resume ready.",
                    status: "todo"
                },
                {
                    phase: "Commitment",
                    task: "Aim for at least 4 hours a week to make a meaningful impact.",
                    status: "todo"
                }
            ]
        });
    }
    return generated;
}

function mapSubjectToCategory(subj) {
    if (["Biology", "Computer Science", "Data Analysis", "Environmental Science", "Public Health", "University Lab"].some(s => subj.includes(s))) return "STEM";
    if (["Political Science", "City Council"].some(s => subj.includes(s))) return "Leadership";
    if (["Creative Writing", "Graphic Design"].some(s => subj.includes(s))) return "Arts";
    return "Humanities"; // Default / Catch-all
}

// Combine Curated with Generated
const allActivities = [...activitiesData, ...generateActivities(1000)];

// Expose to window for global access in script.js
window.activitiesData = allActivities;
