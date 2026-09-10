package com.examly.springapp;

import java.io.File;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = SpringappApplication.class)
@AutoConfigureMockMvc
public class SpringappTimetableTests {

    @Autowired
    private MockMvc mockMvc;

    // === API TESTS ===

    @Test
    void test_Add_Schedule() throws Exception {
        String json = """
        {
          "className": "10A",
          "subject": "Math",
          "teacherName": "Mr. Smith",
          "dayOfWeek": "Monday",
          "startTime": "09:00",
          "endTime": "10:00",
          "attendanceNote": "Present"
        }
        """;

        mockMvc.perform(post("/api/schedule/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void test_Get_All_Schedules() throws Exception {
        mockMvc.perform(get("/api/schedule/all")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    // === DIRECTORY CHECKS ===

    @Test
    void test_Controller_Directory_Exists() {
        File dir = new File("src/main/java/com/examly/springapp/controller");
        assertTrue(dir.exists() && dir.isDirectory());
    }

    @Test
    void test_Model_Directory_Exists() {
        File dir = new File("src/main/java/com/examly/springapp/model");
        assertTrue(dir.exists() && dir.isDirectory());
    }

    @Test
    void test_Repository_Directory_Exists() {
        File dir = new File("src/main/java/com/examly/springapp/repository");
        assertTrue(dir.exists() && dir.isDirectory());
    }

    @Test
    void test_Service_Directory_Exists() {
        File dir = new File("src/main/java/com/examly/springapp/service");
        assertTrue(dir.exists() && dir.isDirectory());
    }

    // === FILE CHECKS ===

    @Test
    void test_ScheduleModel_File_Exists() {
        File file = new File("src/main/java/com/examly/springapp/model/ScheduleEntry.java");
        assertTrue(file.exists());
    }

    @Test
    void test_ScheduleController_File_Exists() {
        File file = new File("src/main/java/com/examly/springapp/controller/ScheduleController.java");
        assertTrue(file.exists());
    }

    @Test
    void test_ScheduleRepository_File_Exists() {
        File file = new File("src/main/java/com/examly/springapp/repository/ScheduleRepository.java");
        assertTrue(file.exists());
    }

    @Test
    void test_ScheduleService_File_Exists() {
        File file = new File("src/main/java/com/examly/springapp/service/ScheduleService.java");
        assertTrue(file.exists());
    }

    // === CLASS CHECKS ===

    @Test
    void test_ScheduleModel_Class_Exists() {
        checkClassExists("com.examly.springapp.model.ScheduleEntry");
    }

    // === FIELD CHECKS ===

    @Test
    void test_Schedule_Has_ClassName_Field() {
        checkFieldExists("com.examly.springapp.model.ScheduleEntry", "className");
    }


    @Test
    void test_Schedule_Has_AttendanceNote_Field() {
        checkFieldExists("com.examly.springapp.model.ScheduleEntry", "attendanceNote");
    }

    // === UTILITY METHODS ===

    private void checkClassExists(String className) {
        try {
            Class.forName(className);
        } catch (ClassNotFoundException e) {
            fail("Class " + className + " does not exist.");
        }
    }

    private void checkFieldExists(String className, String fieldName) {
        try {
            Class<?> clazz = Class.forName(className);
            clazz.getDeclaredField(fieldName);
        } catch (ClassNotFoundException | NoSuchFieldException e) {
            fail("Field " + fieldName + " not found in " + className);
        }
    }
}
