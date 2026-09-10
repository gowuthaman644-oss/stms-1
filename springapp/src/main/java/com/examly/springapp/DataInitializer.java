package com.examly.springapp;

import com.examly.springapp.model.AcademicEvent;
import com.examly.springapp.model.AttendanceRecord;
import com.examly.springapp.model.Room;
import com.examly.springapp.model.ScheduleEntry;
import com.examly.springapp.model.UserAccount;
import com.examly.springapp.repository.AcademicEventRepository;
import com.examly.springapp.repository.AttendanceRepository;
import com.examly.springapp.repository.RoomRepository;
import com.examly.springapp.repository.ScheduleRepository;
import com.examly.springapp.repository.UserAccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserAccountRepository userAccountRepository;
    private final ScheduleRepository scheduleRepository;
    private final AttendanceRepository attendanceRepository;
    private final RoomRepository roomRepository;
    private final AcademicEventRepository academicEventRepository;

    public DataInitializer(UserAccountRepository userAccountRepository,
                           ScheduleRepository scheduleRepository,
                           AttendanceRepository attendanceRepository,
                           RoomRepository roomRepository,
                           AcademicEventRepository academicEventRepository) {
        this.userAccountRepository = userAccountRepository;
        this.scheduleRepository = scheduleRepository;
        this.attendanceRepository = attendanceRepository;
        this.roomRepository = roomRepository;
        this.academicEventRepository = academicEventRepository;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedRooms();
        seedAcademicEvents();
        seedSchedules();
        seedAttendance();
    }

    private void seedUsers() {
        if (userAccountRepository.count() > 5) {
            return;
        }

        userAccountRepository.deleteAll();

        List<UserAccount> users = new ArrayList<>();

        // === 1. ADMINS ===
        users.add(new UserAccount("admin", "admin@stms.edu", "admin123", "ADMIN", "Dr. Arthur Vance", "Administration", "EMP001", "", "All"));
        users.add(new UserAccount("kvenkat", "k.venkat@stms.edu", "admin123", "ADMIN", "Dr. K. Venkataraman", "Administration", "EMP002", "", "All"));
        users.add(new UserAccount("sbanerjee", "s.banerjee@stms.edu", "admin123", "ADMIN", "Dr. S. Banerjee", "Academic Affairs", "EMP003", "", "All"));

        // === 2. TEACHERS ===
        users.add(new UserAccount("teacher", "c.evans@stms.edu", "teacher123", "TEACHER", "Prof. Clara Evans", "Science & Biology", "EMP014", "", "10-A"));
        users.add(new UserAccount("pkrishnan", "p.krishnan@stms.edu", "teacher123", "TEACHER", "Priya Krishnan", "Mathematics Department", "EMP101", "", "10-A"));
        users.add(new UserAccount("skumar", "s.kumar@stms.edu", "teacher123", "TEACHER", "Suresh Kumar", "Science Department", "EMP102", "", "10-A"));
        users.add(new UserAccount("miyer", "m.iyer@stms.edu", "teacher123", "TEACHER", "Meena Iyer", "English Literature", "EMP103", "", "9-B"));
        users.add(new UserAccount("araj", "a.raj@stms.edu", "teacher123", "TEACHER", "Arvind Raj", "Computer Science", "EMP104", "", "8-A"));
        users.add(new UserAccount("lnair", "l.nair@stms.edu", "teacher123", "TEACHER", "Lakshmi Nair", "Tamil Language", "EMP105", "", "7-A"));
        users.add(new UserAccount("rmenon_t", "r.menon@stms.edu", "teacher123", "TEACHER", "Ramesh Menon", "Social Science", "EMP106", "", "6-B"));
        users.add(new UserAccount("dsharma_t", "d.sharma@stms.edu", "teacher123", "TEACHER", "Divya Sharma", "Mathematics Department", "EMP107", "", "9-A"));
        users.add(new UserAccount("vkumar", "v.kumar@stms.edu", "teacher123", "TEACHER", "Vijay Kumar", "Physics Department", "EMP108", "", "8-B"));
        users.add(new UserAccount("areddy", "a.reddy@stms.edu", "teacher123", "TEACHER", "Anitha Reddy", "Chemistry Department", "EMP109", "", "10-B"));
        users.add(new UserAccount("msrinivasan_t", "m.srinivasan@stms.edu", "teacher123", "TEACHER", "Mohan Srinivasan", "Biology Department", "EMP110", "", "7-B"));
        users.add(new UserAccount("dnair", "d.nair@stms.edu", "teacher123", "TEACHER", "Deepa Nair", "Hindi Language", "EMP111", "", "6-A"));
        users.add(new UserAccount("skumar_pe", "senthil.k@stms.edu", "teacher123", "TEACHER", "Senthil Kumar", "Physical Education", "EMP112", "", "All"));

        // === 3. STUDENTS (Classes 6-A to 10-B) ===
        users.add(new UserAccount("student", "a.rivera@student.stms.edu", "student123", "STUDENT", "Alex Rivera", "Secondary Section", "", "STU1024", "10-A"));
        users.add(new UserAccount("asharma", "a.sharma@student.stms.edu", "student123", "STUDENT", "Aarav Sharma", "Secondary Section", "", "STU2001", "10-A"));
        users.add(new UserAccount("smenon", "s.menon@student.stms.edu", "student123", "STUDENT", "Sanjay Menon", "Secondary Section", "", "STU2002", "10-A"));
        users.add(new UserAccount("vpatel", "v.patel@student.stms.edu", "student123", "STUDENT", "Vikram Patel", "Secondary Section", "", "STU2003", "10-A"));

        users.add(new UserAccount("dkrishnan", "d.krishnan@student.stms.edu", "student123", "STUDENT", "Diya Krishnan", "Secondary Section", "", "STU2004", "10-B"));
        users.add(new UserAccount("asingh", "a.singh@student.stms.edu", "student123", "STUDENT", "Abhinav Singh", "Secondary Section", "", "STU2005", "10-B"));
        users.add(new UserAccount("aisharma", "aish.sharma@student.stms.edu", "student123", "STUDENT", "Aishwarya Sharma", "Secondary Section", "", "STU2006", "10-B"));

        users.add(new UserAccount("aiyer", "a.iyer@student.stms.edu", "student123", "STUDENT", "Ananya Iyer", "Secondary Section", "", "STU2007", "9-A"));
        users.add(new UserAccount("akumar", "a.kumar@student.stms.edu", "student123", "STUDENT", "Arjun Kumar", "Secondary Section", "", "STU2008", "9-A"));
        users.add(new UserAccount("igupta", "i.gupta@student.stms.edu", "student123", "STUDENT", "Ishita Gupta", "Secondary Section", "", "STU2009", "9-A"));

        users.add(new UserAccount("rnair", "r.nair@student.stms.edu", "student123", "STUDENT", "Rahul Nair", "Secondary Section", "", "STU2010", "9-B"));
        users.add(new UserAccount("msrinivasan", "m.srinivasan@student.stms.edu", "student123", "STUDENT", "Meera Srinivasan", "Secondary Section", "", "STU2011", "9-B"));
        users.add(new UserAccount("kraj", "k.raj@student.stms.edu", "student123", "STUDENT", "Karthik Raj", "Secondary Section", "", "STU2012", "9-B"));

        users.add(new UserAccount("sreddy", "s.reddy@student.stms.edu", "student123", "STUDENT", "Sneha Reddy", "Middle Section", "", "STU2013", "8-A"));
        users.add(new UserAccount("averma", "a.verma@student.stms.edu", "student123", "STUDENT", "Aditya Verma", "Middle Section", "", "STU2014", "8-A"));
        users.add(new UserAccount("nkumar", "n.kumar@student.stms.edu", "student123", "STUDENT", "Nandhini Kumar", "Middle Section", "", "STU2015", "8-A"));

        users.add(new UserAccount("hraj", "h.raj@student.stms.edu", "student123", "STUDENT", "Harish Raj", "Middle Section", "", "STU2016", "8-B"));
        users.add(new UserAccount("pjoshi", "p.joshi@student.stms.edu", "student123", "STUDENT", "Pooja Joshi", "Middle Section", "", "STU2017", "8-B"));
        users.add(new UserAccount("rdeshmukh", "r.deshmukh@student.stms.edu", "student123", "STUDENT", "Rohan Deshmukh", "Middle Section", "", "STU2018", "8-B"));

        users.add(new UserAccount("knair", "k.nair@student.stms.edu", "student123", "STUDENT", "Kavya Nair", "Middle Section", "", "STU2019", "7-A"));
        users.add(new UserAccount("sbose", "s.bose@student.stms.edu", "student123", "STUDENT", "Sourav Bose", "Middle Section", "", "STU2020", "7-A"));
        users.add(new UserAccount("tmenon", "t.menon@student.stms.edu", "student123", "STUDENT", "Tanvi Menon", "Middle Section", "", "STU2021", "7-A"));

        users.add(new UserAccount("rmenon", "r.menon@student.stms.edu", "student123", "STUDENT", "Rohit Menon", "Middle Section", "", "STU2022", "7-B"));
        users.add(new UserAccount("mchatterjee", "m.chatterjee@student.stms.edu", "student123", "STUDENT", "Mitali Chatterjee", "Middle Section", "", "STU2023", "7-B"));
        users.add(new UserAccount("vsharma", "v.sharma@student.stms.edu", "student123", "STUDENT", "Varun Sharma", "Middle Section", "", "STU2024", "7-B"));

        users.add(new UserAccount("kreddy", "k.reddy@student.stms.edu", "student123", "STUDENT", "Keerthana Reddy", "Primary Section", "", "STU2025", "6-A"));
        users.add(new UserAccount("npatil", "n.patil@student.stms.edu", "student123", "STUDENT", "Nikhil Patil", "Primary Section", "", "STU2026", "6-A"));
        users.add(new UserAccount("ssundaram", "s.sundaram@student.stms.edu", "student123", "STUDENT", "Swathi Sundaram", "Primary Section", "", "STU2027", "6-A"));

        users.add(new UserAccount("piyer", "p.iyer@student.stms.edu", "student123", "STUDENT", "Pooja Iyer", "Primary Section", "", "STU2028", "6-B"));
        users.add(new UserAccount("dgoutam", "d.goutam@student.stms.edu", "student123", "STUDENT", "Dhruv Goutam", "Primary Section", "", "STU2029", "6-B"));
        users.add(new UserAccount("rpillai", "r.pillai@student.stms.edu", "student123", "STUDENT", "Rithanya Pillai", "Primary Section", "", "STU2030", "6-B"));

        // === 4. PARENTS (Single-child & Multi-child) ===
        UserAccount pDemo = new UserAccount("parent", "s.rivera@parent.stms.edu", "parent123", "PARENT", "Sarah Rivera", "Parent Community", "", "", "10-A");
        pDemo.setLinkedStudentUsername("student");
        pDemo.setLinkedStudentName("Alex Rivera");
        pDemo.setLinkedStudentClass("10-A");
        users.add(pDemo);

        UserAccount pRavi = new UserAccount("rkumar", "ravi.k@parent.stms.edu", "parent123", "PARENT", "Ravi Kumar", "Parent Community", "", "", "10-A");
        pRavi.setLinkedStudentUsername("asharma");
        pRavi.setLinkedStudentName("Aarav Sharma");
        pRavi.setLinkedStudentClass("10-A");
        users.add(pRavi);

        UserAccount pDivya = new UserAccount("dsharma_p", "divya.s@parent.stms.edu", "parent123", "PARENT", "Divya Sharma", "Parent Community", "", "", "9-A");
        pDivya.setLinkedStudentUsername("aiyer");
        pDivya.setLinkedStudentName("Ananya Iyer");
        pDivya.setLinkedStudentClass("9-A");
        users.add(pDivya);

        UserAccount pAnand = new UserAccount("akrishnan", "anand.k@parent.stms.edu", "parent123", "PARENT", "Anand Krishnan", "Parent Community", "", "", "10-B");
        pAnand.setLinkedStudentUsername("dkrishnan");
        pAnand.setLinkedStudentName("Diya Krishnan");
        pAnand.setLinkedStudentClass("10-B");
        users.add(pAnand);

        // Multi-child Parent 1: Geetha Reddy (Sneha Reddy 8-A, Keerthana Reddy 6-A)
        UserAccount pGeetha = new UserAccount("greddy", "geetha.r@parent.stms.edu", "parent123", "PARENT", "Geetha Reddy", "Parent Community", "", "", "8-A");
        pGeetha.setLinkedStudentUsername("sreddy,kreddy");
        pGeetha.setLinkedStudentName("Sneha Reddy");
        pGeetha.setLinkedStudentClass("8-A");
        users.add(pGeetha);

        // Multi-child Parent 2: Suresh Nair (Kavya Nair 7-A, Rahul Nair 9-B)
        UserAccount pSuresh = new UserAccount("snair_p", "suresh.n@parent.stms.edu", "parent123", "PARENT", "Suresh Nair", "Parent Community", "", "", "7-A");
        pSuresh.setLinkedStudentUsername("knair,rnair");
        pSuresh.setLinkedStudentName("Kavya Nair");
        pSuresh.setLinkedStudentClass("7-A");
        users.add(pSuresh);

        UserAccount pMeena = new UserAccount("mraj_p", "meena.r@parent.stms.edu", "parent123", "PARENT", "Meena Raj", "Parent Community", "", "", "8-B");
        pMeena.setLinkedStudentUsername("hraj");
        pMeena.setLinkedStudentName("Harish Raj");
        pMeena.setLinkedStudentClass("8-B");
        users.add(pMeena);

        UserAccount pPrakash = new UserAccount("piyer_p", "prakash.i@parent.stms.edu", "parent123", "PARENT", "Prakash Iyer", "Parent Community", "", "", "6-B");
        pPrakash.setLinkedStudentUsername("piyer");
        pPrakash.setLinkedStudentName("Pooja Iyer");
        pPrakash.setLinkedStudentClass("6-B");
        users.add(pPrakash);

        // Multi-child Parent 3: Kavitha Menon (Rohit Menon 7-B, Sanjay Menon 10-A)
        UserAccount pKavitha = new UserAccount("kmenon_p", "kavitha.m@parent.stms.edu", "parent123", "PARENT", "Kavitha Menon", "Parent Community", "", "", "7-B");
        pKavitha.setLinkedStudentUsername("rmenon,smenon");
        pKavitha.setLinkedStudentName("Rohit Menon");
        pKavitha.setLinkedStudentClass("7-B");
        users.add(pKavitha);

        UserAccount pVirendra = new UserAccount("vpatel_p", "virendra.p@parent.stms.edu", "parent123", "PARENT", "Virendra Patel", "Parent Community", "", "", "10-A");
        pVirendra.setLinkedStudentUsername("vpatel");
        pVirendra.setLinkedStudentName("Vikram Patel");
        pVirendra.setLinkedStudentClass("10-A");
        users.add(pVirendra);

        UserAccount pVikash = new UserAccount("vgupta_p", "vikash.g@parent.stms.edu", "parent123", "PARENT", "Vikash Gupta", "Parent Community", "", "", "9-A");
        pVikash.setLinkedStudentUsername("igupta");
        pVikash.setLinkedStudentName("Ishita Gupta");
        pVikash.setLinkedStudentClass("9-A");
        users.add(pVikash);

        userAccountRepository.saveAll(users);
    }

    private void seedRooms() {
        if (roomRepository.count() > 5) {
            return;
        }

        roomRepository.deleteAll();

        List<Room> rooms = new ArrayList<>();
        rooms.add(new Room("Room 101", "Main Academic Block", 40, "Classroom", "Smartboard, 4K Projector"));
        rooms.add(new Room("Room 102", "Main Academic Block", 40, "Classroom", "Smartboard, Whiteboard"));
        rooms.add(new Room("Room 103", "Main Academic Block", 40, "Classroom", "Smartboard, Sound System"));
        rooms.add(new Room("Room 201", "Science & Tech Block", 35, "Classroom", "Interactive Display, Whiteboard"));
        rooms.add(new Room("Room 202", "Science & Tech Block", 35, "Classroom", "Projector, Audio System"));
        
        Room scLab = new Room("Science Laboratory", "Science Pavilion", 35, "Laboratory", "Microscopes, Chemical Fume Hoods, Burners");
        rooms.add(scLab);

        Room compLab = new Room("Computer Laboratory", "Technology Wing", 40, "Computer Lab", "40 High-spec Workstations, Gigabit LAN");
        rooms.add(compLab);

        rooms.add(new Room("Mathematics Lab", "Main Academic Block", 30, "Classroom", "Geometry Toolkits, Graphing Tablets"));
        rooms.add(new Room("Library", "Knowledge Complex", 80, "Classroom", "Reference Catalog, Reading Desks, High-speed WiFi"));
        rooms.add(new Room("Auditorium", "Administrative Complex", 250, "Auditorium", "Stage Lighting, Acoustic Sound, Dual 4K Screens"));
        rooms.add(new Room("Seminar Hall", "Library Complex", 120, "Auditorium", "Dual Projectors, Audio System, Mic Pods"));
        rooms.add(new Room("Sports Room", "Athletic Pavilion", 50, "Classroom", "Indoor Games, Fitness Gear, Sound System"));

        roomRepository.saveAll(rooms);
    }

    private void seedAcademicEvents() {
        if (academicEventRepository.count() > 5) {
            return;
        }

        academicEventRepository.deleteAll();

        List<AcademicEvent> events = new ArrayList<>();
        events.add(new AcademicEvent("2026-2027", "Independence Day Celebration", "HOLIDAY", "2026-08-15", "2026-08-15", true, "National Flag hoisting and patriotic cultural assembly."));
        events.add(new AcademicEvent("2026-2027", "Teachers' Day", "TERM_START", "2026-09-05", "2026-09-05", false, "Special student-led honoring ceremonies and academic presentations."));
        events.add(new AcademicEvent("2026-2027", "Quarterly Examination", "EXAM_PERIOD", "2026-09-21", "2026-09-30", false, "First term evaluation assessments across grades 6 to 10."));
        events.add(new AcademicEvent("2026-2027", "Gandhi Jayanti Holiday", "HOLIDAY", "2026-10-02", "2026-10-02", true, "National holiday observing the birth anniversary of Mahatma Gandhi."));
        events.add(new AcademicEvent("2026-2027", "Science Exhibition", "TERM_START", "2026-10-16", "2026-10-17", false, "Inter-class science model display, robotics demos, and innovation fair."));
        events.add(new AcademicEvent("2026-2027", "Diwali & Autumn Break", "HOLIDAY", "2026-10-30", "2026-11-04", true, "School closed for festive holidays."));
        events.add(new AcademicEvent("2026-2027", "Half-Yearly Examination", "EXAM_PERIOD", "2026-11-16", "2026-11-27", false, "Comprehensive mid-year examinations for all grades."));
        events.add(new AcademicEvent("2026-2027", "Annual Sports Day", "TERM_START", "2026-12-04", "2026-12-05", false, "Track and field events, march-past, and inter-house athletic meets."));
        events.add(new AcademicEvent("2026-2027", "School Annual Day", "TERM_START", "2026-12-22", "2026-12-22", false, "Grand cultural gala, drama, music, and academic prize distributions."));
        events.add(new AcademicEvent("2026-2027", "Winter Vacation", "HOLIDAY", "2026-12-23", "2027-01-03", true, "Campus winter break. Administrative offices open on reduced schedule."));
        events.add(new AcademicEvent("2026-2027", "Republic Day Celebration", "HOLIDAY", "2027-01-26", "2027-01-26", true, "National holiday, ceremonial parade and flag unfurling ceremony."));
        events.add(new AcademicEvent("2026-2027", "Parent-Teacher Meeting", "TERM_END", "2027-02-12", "2027-02-13", false, "Term progress reporting and one-on-one parent feedback sessions."));
        events.add(new AcademicEvent("2026-2027", "Annual Final Examinations", "EXAM_PERIOD", "2027-03-15", "2027-03-30", false, "End of year cumulative academic board examinations."));
        events.add(new AcademicEvent("2026-2027", "Inter-School Competition", "TERM_END", "2027-04-05", "2027-04-07", false, "Zonal academic quiz, debate, and mathematics olympiad."));

        academicEventRepository.saveAll(events);
    }

    private void seedSchedules() {
        if (scheduleRepository.count() > 10) {
            return;
        }

        scheduleRepository.deleteAll();

        String[] classes = {"10-A", "10-B", "9-A", "9-B", "8-A", "8-B", "7-A", "7-B", "6-A", "6-B"};
        String[] days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday"};
        String[][] slots = {
                {"08:30", "09:15"},
                {"09:15", "10:00"},
                {"10:15", "11:00"},
                {"11:00", "11:45"},
                {"12:30", "01:15"},
                {"01:15", "02:00"},
                {"02:00", "02:45"}
        };

        String[][] offerings = {
                {"Mathematics", "Priya Krishnan"},
                {"Science", "Suresh Kumar"},
                {"English", "Meena Iyer"},
                {"Computer Science", "Arvind Raj"},
                {"Tamil", "Lakshmi Nair"},
                {"Social Science", "Ramesh Menon"},
                {"Physics", "Vijay Kumar"},
                {"Chemistry", "Anitha Reddy"},
                {"Biology", "Mohan Srinivasan"},
                {"Hindi", "Deepa Nair"},
                {"Physical Education", "Senthil Kumar"},
                {"Mathematics", "Divya Sharma"}
        };

        String[] rooms = {
                "Room 101", "Room 102", "Room 103", "Room 201", "Room 202",
                "Science Laboratory", "Computer Laboratory", "Mathematics Lab",
                "Library", "Auditorium", "Seminar Hall", "Sports Room"
        };

        List<ScheduleEntry> entries = new ArrayList<>();

        for (int d = 0; d < days.length; d++) {
            for (int s = 0; s < slots.length; s++) {
                int shift = (d * 7 + s) % offerings.length;
                for (int c = 0; c < classes.length; c++) {
                    int offIdx = (shift + c) % offerings.length;
                    String subject = offerings[offIdx][0];
                    String teacher = offerings[offIdx][1];
                    String room = rooms[offIdx];

                    ScheduleEntry entry = new ScheduleEntry();
                    entry.setClassName(classes[c]);
                    entry.setSubject(subject);
                    entry.setTeacherName(teacher);
                    entry.setDayOfWeek(days[d]);
                    entry.setStartTime(slots[s][0]);
                    entry.setEndTime(slots[s][1]);
                    entry.setAttendanceNote(room);

                    entries.add(entry);
                }
            }
        }

        scheduleRepository.saveAll(entries);
    }

    private void seedAttendance() {
        if (attendanceRepository.count() > 10) {
            return;
        }

        attendanceRepository.deleteAll();

        List<AttendanceRecord> records = new ArrayList<>();

        String[] dates = {"2026-09-01", "2026-09-02", "2026-09-03", "2026-09-04", "2026-09-07",
                          "2026-09-08", "2026-09-09", "2026-09-10", "2026-09-11", "2026-09-14"};

        // Student configurations: {name, username, class, studentId, presentCount, absentCount, lateCount, excusedCount}
        Object[][] studentConfigs = {
                // High attendance students (90% - 100%)
                {"Alex Rivera", "student", "10-A", "STU1024", 9, 0, 1, 0},
                {"Aarav Sharma", "asharma", "10-A", "STU2001", 9, 0, 0, 1},
                {"Vikram Patel", "vpatel", "10-A", "STU2003", 10, 0, 0, 0},
                {"Diya Krishnan", "dkrishnan", "10-B", "STU2004", 10, 0, 0, 0},
                {"Aishwarya Sharma", "aisharma", "10-B", "STU2006", 9, 0, 1, 0},
                {"Arjun Kumar", "akumar", "9-A", "STU2008", 9, 0, 0, 1},
                {"Meera Srinivasan", "msrinivasan", "9-B", "STU2011", 10, 0, 0, 0},
                {"Sneha Reddy", "sreddy", "8-A", "STU2013", 9, 0, 1, 0},
                {"Nandhini Kumar", "nkumar", "8-A", "STU2015", 10, 0, 0, 0},
                {"Pooja Joshi", "pjoshi", "8-B", "STU2017", 10, 0, 0, 0},
                {"Kavya Nair", "knair", "7-A", "STU2019", 9, 0, 0, 1},
                {"Keerthana Reddy", "kreddy", "6-A", "STU2025", 9, 0, 1, 0},
                {"Pooja Iyer", "piyer", "6-B", "STU2028", 10, 0, 0, 0},

                // Moderate attendance (80%)
                {"Sanjay Menon", "smenon", "10-A", "STU2002", 8, 2, 0, 0},
                {"Abhinav Singh", "asingh", "10-B", "STU2005", 8, 0, 2, 0},
                {"Ananya Iyer", "aiyer", "9-A", "STU2007", 8, 1, 1, 0},
                {"Karthik Raj", "kraj", "9-B", "STU2012", 8, 0, 2, 0},
                {"Aditya Verma", "averma", "8-A", "STU2014", 8, 2, 0, 0},
                {"Rohit Menon", "rmenon", "7-B", "STU2022", 8, 0, 2, 0},

                // Below 75% attendance (<75% to trigger alert warning!)
                {"Ishita Gupta", "igupta", "9-A", "STU2009", 7, 3, 0, 0}, // 70.0%
                {"Rahul Nair", "rnair", "9-B", "STU2010", 7, 3, 0, 0},   // 70.0%
                {"Harish Raj", "hraj", "8-B", "STU2016", 7, 2, 1, 0}     // 70.0%
        };

        for (Object[] cfg : studentConfigs) {
            String name = (String) cfg[0];
            String cls = (String) cfg[2];
            String stuId = (String) cfg[3];
            int pCount = (int) cfg[4];
            int aCount = (int) cfg[5];
            int lCount = (int) cfg[6];
            int eCount = (int) cfg[7];

            List<String> statuses = new ArrayList<>();
            for (int i = 0; i < pCount; i++) statuses.add("PRESENT");
            for (int i = 0; i < aCount; i++) statuses.add("ABSENT");
            for (int i = 0; i < lCount; i++) statuses.add("LATE");
            for (int i = 0; i < eCount; i++) statuses.add("EXCUSED");

            for (int i = 0; i < Math.min(dates.length, statuses.size()); i++) {
                String d = dates[i];
                String st = statuses.get(i);
                String subj = (i % 2 == 0) ? "Mathematics" : "Science";
                String teacher = (i % 2 == 0) ? "Priya Krishnan" : "Suresh Kumar";

                AttendanceRecord record = new AttendanceRecord(
                        cls,
                        subj,
                        teacher,
                        name,
                        stuId,
                        d,
                        st,
                        "Regular classroom period session on " + d,
                        d + "T09:15:00"
                );
                records.add(record);
            }
        }

        attendanceRepository.saveAll(records);
    }
}
