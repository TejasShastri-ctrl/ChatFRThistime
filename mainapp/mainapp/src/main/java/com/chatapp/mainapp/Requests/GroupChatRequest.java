package com.chatapp.mainapp.Requests;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupChatRequest {
    private List<Integer> userIds;
    private  String chat_name;
    private String chat_image;
}
