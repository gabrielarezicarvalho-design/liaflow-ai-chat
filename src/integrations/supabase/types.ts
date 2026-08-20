export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      agent_documents: {
        Row: {
          agent_id: string
          content_text: string | null
          created_at: string | null
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          name: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agent_id: string
          content_text?: string | null
          created_at?: string | null
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          name: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agent_id?: string
          content_text?: string | null
          created_at?: string | null
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          name?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_documents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_functions: {
        Row: {
          agent_id: string
          config: Json | null
          created_at: string | null
          description: string | null
          function_type: string
          id: string
          is_enabled: boolean | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agent_id: string
          config?: Json | null
          created_at?: string | null
          description?: string | null
          function_type: string
          id?: string
          is_enabled?: boolean | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agent_id?: string
          config?: Json | null
          created_at?: string | null
          description?: string | null
          function_type?: string
          id?: string
          is_enabled?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_functions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_knowledge_chunks: {
        Row: {
          agent_id: string
          chunk_index: number
          company_id: string | null
          content: string
          created_at: string
          embedding: string
          id: string
          token_count: number | null
        }
        Insert: {
          agent_id: string
          chunk_index: number
          company_id?: string | null
          content: string
          created_at?: string
          embedding: string
          id?: string
          token_count?: number | null
        }
        Update: {
          agent_id?: string
          chunk_index?: number
          company_id?: string | null
          content?: string
          created_at?: string
          embedding?: string
          id?: string
          token_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_knowledge_chunks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_knowledge_chunks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          ai_provider_for_audio: string | null
          ai_provider_for_vision: string | null
          avg_response_time: string | null
          behavior: string | null
          can_process_pdf: boolean | null
          can_process_video: boolean | null
          can_send_images: boolean | null
          can_understand_audio: boolean | null
          can_understand_images: boolean | null
          conversations_today: number | null
          created_at: string | null
          id: string
          knowledge_images: string[] | null
          knowledge_text: string | null
          model: string | null
          name: string
          output_markers: string | null
          platform: string
          response_style: string | null
          satisfaction: string | null
          signature: string | null
          status: string | null
          system_prompt: string | null
          temperature: number | null
          updated_at: string | null
          user_id: string
          voice_enabled: boolean | null
          voice_id: string | null
          voice_similarity: number | null
          voice_speed: number | null
          voice_stability: number | null
        }
        Insert: {
          ai_provider_for_audio?: string | null
          ai_provider_for_vision?: string | null
          avg_response_time?: string | null
          behavior?: string | null
          can_process_pdf?: boolean | null
          can_process_video?: boolean | null
          can_send_images?: boolean | null
          can_understand_audio?: boolean | null
          can_understand_images?: boolean | null
          conversations_today?: number | null
          created_at?: string | null
          id?: string
          knowledge_images?: string[] | null
          knowledge_text?: string | null
          model?: string | null
          name: string
          output_markers?: string | null
          platform: string
          response_style?: string | null
          satisfaction?: string | null
          signature?: string | null
          status?: string | null
          system_prompt?: string | null
          temperature?: number | null
          updated_at?: string | null
          user_id: string
          voice_enabled?: boolean | null
          voice_id?: string | null
          voice_similarity?: number | null
          voice_speed?: number | null
          voice_stability?: number | null
        }
        Update: {
          ai_provider_for_audio?: string | null
          ai_provider_for_vision?: string | null
          avg_response_time?: string | null
          behavior?: string | null
          can_process_pdf?: boolean | null
          can_process_video?: boolean | null
          can_send_images?: boolean | null
          can_understand_audio?: boolean | null
          can_understand_images?: boolean | null
          conversations_today?: number | null
          created_at?: string | null
          id?: string
          knowledge_images?: string[] | null
          knowledge_text?: string | null
          model?: string | null
          name?: string
          output_markers?: string | null
          platform?: string
          response_style?: string | null
          satisfaction?: string | null
          signature?: string | null
          status?: string | null
          system_prompt?: string | null
          temperature?: number | null
          updated_at?: string | null
          user_id?: string
          voice_enabled?: boolean | null
          voice_id?: string | null
          voice_similarity?: number | null
          voice_speed?: number | null
          voice_stability?: number | null
        }
        Relationships: []
      }
      ai_provider_keys: {
        Row: {
          api_key: string | null
          created_at: string | null
          id: string
          is_configured: boolean | null
          is_valid: boolean | null
          last_validated_at: string | null
          provider: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_key?: string | null
          created_at?: string | null
          id?: string
          is_configured?: boolean | null
          is_valid?: boolean | null
          last_validated_at?: string | null
          provider: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_key?: string | null
          created_at?: string | null
          id?: string
          is_configured?: boolean | null
          is_valid?: boolean | null
          last_validated_at?: string | null
          provider?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_tickets: {
        Row: {
          agent_id: string | null
          ai_summary: string | null
          best_contact_time: string | null
          connection_id: string | null
          contact_name: string | null
          contact_phone: string
          conversation_id: string | null
          created_at: string
          dissatisfaction_level: string | null
          id: string
          notes: string | null
          priority: string | null
          reason: string
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id?: string | null
          ai_summary?: string | null
          best_contact_time?: string | null
          connection_id?: string | null
          contact_name?: string | null
          contact_phone: string
          conversation_id?: string | null
          created_at?: string
          dissatisfaction_level?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          reason: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string | null
          ai_summary?: string | null
          best_contact_time?: string | null
          connection_id?: string | null
          contact_name?: string | null
          contact_phone?: string
          conversation_id?: string | null
          created_at?: string
          dissatisfaction_level?: string | null
          id?: string
          notes?: string | null
          priority?: string | null
          reason?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_tickets_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_tickets_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_tickets_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          created_at: string
          environment: string | null
          id: number
          meta_api_version: string | null
          updated_at: string
          whatsapp_verify_token: string | null
          whatsapp_webhook_callback_url: string | null
        }
        Insert: {
          created_at?: string
          environment?: string | null
          id?: number
          meta_api_version?: string | null
          updated_at?: string
          whatsapp_verify_token?: string | null
          whatsapp_webhook_callback_url?: string | null
        }
        Update: {
          created_at?: string
          environment?: string | null
          id?: number
          meta_api_version?: string | null
          updated_at?: string
          whatsapp_verify_token?: string | null
          whatsapp_webhook_callback_url?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          severity: string
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          severity?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          severity?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      birthday_campaigns: {
        Row: {
          buttons: Json | null
          connection_id: string | null
          created_at: string | null
          days_before: number | null
          id: string
          interactive_type: string | null
          is_active: boolean | null
          last_run_at: string | null
          media_url: string | null
          message_content: string | null
          message_type: string
          name: string
          send_time: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          buttons?: Json | null
          connection_id?: string | null
          created_at?: string | null
          days_before?: number | null
          id?: string
          interactive_type?: string | null
          is_active?: boolean | null
          last_run_at?: string | null
          media_url?: string | null
          message_content?: string | null
          message_type?: string
          name: string
          send_time?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          buttons?: Json | null
          connection_id?: string | null
          created_at?: string | null
          days_before?: number | null
          id?: string
          interactive_type?: string | null
          is_active?: boolean | null
          last_run_at?: string | null
          media_url?: string | null
          message_content?: string | null
          message_type?: string
          name?: string
          send_time?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "birthday_campaigns_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
        ]
      }
      birthday_contacts: {
        Row: {
          birth_date: string
          campaign_id: string | null
          created_at: string | null
          id: string
          last_sent_at: string | null
          last_sent_year: number | null
          name: string
          phone: string
          user_id: string
        }
        Insert: {
          birth_date: string
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          last_sent_at?: string | null
          last_sent_year?: number | null
          name: string
          phone: string
          user_id: string
        }
        Update: {
          birth_date?: string
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          last_sent_at?: string | null
          last_sent_year?: number | null
          name?: string
          phone?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "birthday_contacts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "birthday_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_actions: {
        Row: {
          action_type: string
          campaign_id: string | null
          created_at: string | null
          id: string
          is_enabled: boolean | null
          tag_id: string | null
          template_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          tag_id?: string | null
          template_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          tag_id?: string | null
          template_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_actions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_actions_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_actions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "campaign_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_contacts: {
        Row: {
          campaign_id: string
          created_at: string
          error_message: string | null
          id: string
          phone: string
          sent_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          error_message?: string | null
          id?: string
          phone: string
          sent_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          error_message?: string | null
          id?: string
          phone?: string
          sent_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_contacts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_progress: {
        Row: {
          campaign_name: string
          completed_at: string | null
          connection_id: string | null
          created_at: string
          current_message_index: number
          current_status: string
          delay_max: number
          delay_min: number
          error_message: string | null
          failed_count: number
          id: string
          messages: Json
          next_send_at: string | null
          pause_duration: number
          pause_every_x: number
          pause_until: string | null
          results: Json | null
          sent_count: number
          started_at: string | null
          total_messages: number
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_name: string
          completed_at?: string | null
          connection_id?: string | null
          created_at?: string
          current_message_index?: number
          current_status?: string
          delay_max?: number
          delay_min?: number
          error_message?: string | null
          failed_count?: number
          id?: string
          messages?: Json
          next_send_at?: string | null
          pause_duration?: number
          pause_every_x?: number
          pause_until?: string | null
          results?: Json | null
          sent_count?: number
          started_at?: string | null
          total_messages?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_name?: string
          completed_at?: string | null
          connection_id?: string | null
          created_at?: string
          current_message_index?: number
          current_status?: string
          delay_max?: number
          delay_min?: number
          error_message?: string | null
          failed_count?: number
          id?: string
          messages?: Json
          next_send_at?: string | null
          pause_duration?: number
          pause_every_x?: number
          pause_until?: string | null
          results?: Json | null
          sent_count?: number
          started_at?: string | null
          total_messages?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_progress_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_responses: {
        Row: {
          campaign_id: string | null
          contact_name: string | null
          contact_phone: string
          created_at: string
          id: string
          responded_at: string | null
          response_text: string | null
          response_type: string | null
          response_value: string | null
          user_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          contact_name?: string | null
          contact_phone: string
          created_at?: string
          id?: string
          responded_at?: string | null
          response_text?: string | null
          response_type?: string | null
          response_value?: string | null
          user_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          contact_name?: string | null
          contact_phone?: string
          created_at?: string
          id?: string
          responded_at?: string | null
          response_text?: string | null
          response_type?: string | null
          response_value?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_responses_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_templates: {
        Row: {
          buttons: Json | null
          carousel_cards: Json | null
          connection_id: string | null
          contact_source: string | null
          created_at: string | null
          id: string
          interactive_type: string | null
          list_items: Json | null
          media_url: string | null
          message_content: string | null
          message_type: string
          name: string
          selected_tags: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          buttons?: Json | null
          carousel_cards?: Json | null
          connection_id?: string | null
          contact_source?: string | null
          created_at?: string | null
          id?: string
          interactive_type?: string | null
          list_items?: Json | null
          media_url?: string | null
          message_content?: string | null
          message_type?: string
          name: string
          selected_tags?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          buttons?: Json | null
          carousel_cards?: Json | null
          connection_id?: string | null
          contact_source?: string | null
          created_at?: string | null
          id?: string
          interactive_type?: string | null
          list_items?: Json | null
          media_url?: string | null
          message_content?: string | null
          message_type?: string
          name?: string
          selected_tags?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_templates_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          company_id: string | null
          completed_at: string | null
          created_at: string
          failed_count: number | null
          folder_id: string | null
          id: string
          media_url: string | null
          message_content: string | null
          message_type: string | null
          name: string
          scheduled_at: string | null
          sent_count: number | null
          status: string | null
          total_contacts: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          completed_at?: string | null
          created_at?: string
          failed_count?: number | null
          folder_id?: string | null
          id?: string
          media_url?: string | null
          message_content?: string | null
          message_type?: string | null
          name: string
          scheduled_at?: string | null
          sent_count?: number | null
          status?: string | null
          total_contacts?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          completed_at?: string | null
          created_at?: string
          failed_count?: number | null
          folder_id?: string | null
          id?: string
          media_url?: string | null
          message_content?: string | null
          message_type?: string | null
          name?: string
          scheduled_at?: string | null
          sent_count?: number | null
          status?: string | null
          total_contacts?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_mentions: {
        Row: {
          created_at: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_mentions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string | null
          created_at: string
          file_name: string | null
          file_url: string | null
          id: string
          is_pinned: boolean
          reply_to: string | null
          room_id: string
          sender_id: string
          type: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_pinned?: boolean
          reply_to?: string | null
          room_id: string
          sender_id: string
          type?: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_pinned?: boolean
          reply_to?: string | null
          room_id?: string
          sender_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          id: string
          joined_at: string
          last_read_at: string | null
          role: string
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          last_read_at?: string | null
          role?: string
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          last_read_at?: string | null
          role?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string
          created_by: string
          id: string
          name: string | null
          type: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          created_by: string
          id?: string
          name?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          created_by?: string
          id?: string
          name?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      cobrancas: {
        Row: {
          checkout_url: string | null
          cliente_nome: string
          company_id: string | null
          confirmation_sent_at: string | null
          created_at: string
          descricao: string | null
          id: string
          last_reminder_at: string | null
          mercado_pago_payment_id: string | null
          paid_at: string | null
          pix_copia_cola: string | null
          pix_qr_code: string | null
          recorrencia: string
          referencia: string | null
          reminder_count: number
          status: string
          telefone: string | null
          updated_at: string
          user_id: string | null
          valor: number
          vencimento: string
          whatsapp_connection_id: string | null
        }
        Insert: {
          checkout_url?: string | null
          cliente_nome: string
          company_id?: string | null
          confirmation_sent_at?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          last_reminder_at?: string | null
          mercado_pago_payment_id?: string | null
          paid_at?: string | null
          pix_copia_cola?: string | null
          pix_qr_code?: string | null
          recorrencia?: string
          referencia?: string | null
          reminder_count?: number
          status?: string
          telefone?: string | null
          updated_at?: string
          user_id?: string | null
          valor?: number
          vencimento?: string
          whatsapp_connection_id?: string | null
        }
        Update: {
          checkout_url?: string | null
          cliente_nome?: string
          company_id?: string | null
          confirmation_sent_at?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          last_reminder_at?: string | null
          mercado_pago_payment_id?: string | null
          paid_at?: string | null
          pix_copia_cola?: string | null
          pix_qr_code?: string | null
          recorrencia?: string
          referencia?: string | null
          reminder_count?: number
          status?: string
          telefone?: string | null
          updated_at?: string
          user_id?: string | null
          valor?: number
          vencimento?: string
          whatsapp_connection_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cobrancas_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      cobrancas_recorrentes: {
        Row: {
          cliente_nome: string
          company_id: string
          connection_id: string | null
          cpf_cnpj: string | null
          created_at: string
          descricao: string | null
          dia_vencimento: number
          email: string | null
          id: string
          status: string
          telefone: string
          total_geradas: number
          ultima_cobranca_id: string | null
          ultima_geracao_em: string | null
          updated_at: string
          user_id: string | null
          valor: number
        }
        Insert: {
          cliente_nome: string
          company_id: string
          connection_id?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          descricao?: string | null
          dia_vencimento: number
          email?: string | null
          id?: string
          status?: string
          telefone: string
          total_geradas?: number
          ultima_cobranca_id?: string | null
          ultima_geracao_em?: string | null
          updated_at?: string
          user_id?: string | null
          valor: number
        }
        Update: {
          cliente_nome?: string
          company_id?: string
          connection_id?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          descricao?: string | null
          dia_vencimento?: number
          email?: string | null
          id?: string
          status?: string
          telefone?: string
          total_geradas?: number
          ultima_cobranca_id?: string | null
          ultima_geracao_em?: string | null
          updated_at?: string
          user_id?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "cobrancas_recorrentes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobrancas_recorrentes_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobrancas_recorrentes_ultima_cobranca_id_fkey"
            columns: ["ultima_cobranca_id"]
            isOneToOne: false
            referencedRelation: "cobrancas"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          ai_provider: string | null
          blocked_reason: string | null
          created_at: string | null
          email: string | null
          expires_at: string | null
          features: string[] | null
          gemini_api_key: string | null
          google_drive_connected: boolean | null
          google_drive_folder_id: string | null
          id: string
          is_active: boolean | null
          is_blocked: boolean | null
          logo_url: string | null
          max_connections: number | null
          max_users: number | null
          name: string
          openai_api_key: string | null
          phone: string | null
          plan_id: string | null
          settings: Json | null
          slug: string | null
          storage_limit: number
          supabase_anon_key: string | null
          supabase_service_role_key: string | null
          supabase_url: string | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          ai_provider?: string | null
          blocked_reason?: string | null
          created_at?: string | null
          email?: string | null
          expires_at?: string | null
          features?: string[] | null
          gemini_api_key?: string | null
          google_drive_connected?: boolean | null
          google_drive_folder_id?: string | null
          id?: string
          is_active?: boolean | null
          is_blocked?: boolean | null
          logo_url?: string | null
          max_connections?: number | null
          max_users?: number | null
          name: string
          openai_api_key?: string | null
          phone?: string | null
          plan_id?: string | null
          settings?: Json | null
          slug?: string | null
          storage_limit?: number
          supabase_anon_key?: string | null
          supabase_service_role_key?: string | null
          supabase_url?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_provider?: string | null
          blocked_reason?: string | null
          created_at?: string | null
          email?: string | null
          expires_at?: string | null
          features?: string[] | null
          gemini_api_key?: string | null
          google_drive_connected?: boolean | null
          google_drive_folder_id?: string | null
          id?: string
          is_active?: boolean | null
          is_blocked?: boolean | null
          logo_url?: string | null
          max_connections?: number | null
          max_users?: number | null
          name?: string
          openai_api_key?: string | null
          phone?: string | null
          plan_id?: string | null
          settings?: Json | null
          slug?: string | null
          storage_limit?: number
          supabase_anon_key?: string | null
          supabase_service_role_key?: string | null
          supabase_url?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      company_google_drive_tokens: {
        Row: {
          access_token: string
          company_id: string
          created_at: string | null
          expires_at: string
          folder_id: string | null
          id: string
          refresh_token: string
          updated_at: string | null
        }
        Insert: {
          access_token: string
          company_id: string
          created_at?: string | null
          expires_at: string
          folder_id?: string | null
          id?: string
          refresh_token: string
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          company_id?: string
          created_at?: string | null
          expires_at?: string
          folder_id?: string | null
          id?: string
          refresh_token?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_google_drive_tokens_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      connections: {
        Row: {
          auto_save_contacts: boolean | null
          base_url: string | null
          created_at: string | null
          credentials: Json | null
          environment: string
          filter_groups: boolean | null
          id: string
          instance_id: string | null
          last_test: string | null
          name: string
          platform: string
          status: string | null
          token: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_save_contacts?: boolean | null
          base_url?: string | null
          created_at?: string | null
          credentials?: Json | null
          environment?: string
          filter_groups?: boolean | null
          id?: string
          instance_id?: string | null
          last_test?: string | null
          name: string
          platform: string
          status?: string | null
          token?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_save_contacts?: boolean | null
          base_url?: string | null
          created_at?: string | null
          credentials?: Json | null
          environment?: string
          filter_groups?: boolean | null
          id?: string
          instance_id?: string | null
          last_test?: string | null
          name?: string
          platform?: string
          status?: string | null
          token?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      conversation_backups: {
        Row: {
          backup_month: string
          conversation_id: string
          created_at: string | null
          drive_file_id: string
          drive_file_url: string | null
          file_name: string
          id: string
          lead_id: string | null
          protocol_number: string | null
          user_id: string
        }
        Insert: {
          backup_month: string
          conversation_id: string
          created_at?: string | null
          drive_file_id: string
          drive_file_url?: string | null
          file_name: string
          id?: string
          lead_id?: string | null
          protocol_number?: string | null
          user_id: string
        }
        Update: {
          backup_month?: string
          conversation_id?: string
          created_at?: string | null
          drive_file_id?: string
          drive_file_url?: string | null
          file_name?: string
          id?: string
          lead_id?: string | null
          protocol_number?: string | null
          user_id?: string
        }
        Relationships: []
      }
      conversation_tags: {
        Row: {
          conversation_id: string
          created_at: string | null
          id: string
          tag_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          id?: string
          tag_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_tags_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          agent_id: string | null
          assigned_agent: string | null
          assigned_agent_id: string | null
          attendance_type: string
          closed_at: string | null
          closing_notes: string | null
          connection_id: string | null
          contract_number: string | null
          created_at: string | null
          department_id: string | null
          flow_state: Json | null
          id: string
          last_message: string | null
          lead_id: string | null
          platform: string
          protocol_number: string | null
          sla_flagged: boolean
          sla_flagged_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          user_name: string | null
          user_phone: string | null
        }
        Insert: {
          agent_id?: string | null
          assigned_agent?: string | null
          assigned_agent_id?: string | null
          attendance_type?: string
          closed_at?: string | null
          closing_notes?: string | null
          connection_id?: string | null
          contract_number?: string | null
          created_at?: string | null
          department_id?: string | null
          flow_state?: Json | null
          id?: string
          last_message?: string | null
          lead_id?: string | null
          platform: string
          protocol_number?: string | null
          sla_flagged?: boolean
          sla_flagged_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          user_name?: string | null
          user_phone?: string | null
        }
        Update: {
          agent_id?: string | null
          assigned_agent?: string | null
          assigned_agent_id?: string | null
          attendance_type?: string
          closed_at?: string | null
          closing_notes?: string | null
          connection_id?: string | null
          contract_number?: string | null
          created_at?: string | null
          department_id?: string | null
          flow_state?: Json | null
          id?: string
          last_message?: string | null
          lead_id?: string | null
          platform?: string
          protocol_number?: string | null
          sla_flagged?: boolean
          sla_flagged_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          user_name?: string | null
          user_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_assigned_agent_fkey"
            columns: ["assigned_agent"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      custos: {
        Row: {
          categoria: string | null
          company_id: string | null
          created_at: string
          data: string
          descricao: string
          id: string
          observacoes: string | null
          recorrente: boolean
          updated_at: string
          user_id: string | null
          valor: number
        }
        Insert: {
          categoria?: string | null
          company_id?: string | null
          created_at?: string
          data?: string
          descricao: string
          id?: string
          observacoes?: string | null
          recorrente?: boolean
          updated_at?: string
          user_id?: string | null
          valor?: number
        }
        Update: {
          categoria?: string | null
          company_id?: string | null
          created_at?: string
          data?: string
          descricao?: string
          id?: string
          observacoes?: string | null
          recorrente?: boolean
          updated_at?: string
          user_id?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "custos_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      department_members: {
        Row: {
          agent_id: string
          created_at: string | null
          department_id: string
          id: string
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          department_id: string
          id?: string
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          department_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "department_members_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_members_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          business_hours: Json | null
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_hours?: Json | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_hours?: Json | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      external_api_keys: {
        Row: {
          api_key: string
          company_id: string
          created_at: string
          id: string
          is_active: boolean
          last_used_at: string | null
          name: string
          permissions: string[]
          updated_at: string
          webhook_events: string[] | null
          webhook_url: string | null
        }
        Insert: {
          api_key?: string
          company_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          name: string
          permissions?: string[]
          updated_at?: string
          webhook_events?: string[] | null
          webhook_url?: string | null
        }
        Update: {
          api_key?: string
          company_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          name?: string
          permissions?: string[]
          updated_at?: string
          webhook_events?: string[] | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "external_api_keys_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      external_api_logs: {
        Row: {
          api_key_id: string | null
          company_id: string
          created_at: string
          endpoint: string
          id: string
          ip_address: string | null
          method: string
          request_body: Json | null
          response_body: Json | null
          status_code: number | null
        }
        Insert: {
          api_key_id?: string | null
          company_id: string
          created_at?: string
          endpoint: string
          id?: string
          ip_address?: string | null
          method: string
          request_body?: Json | null
          response_body?: Json | null
          status_code?: number | null
        }
        Update: {
          api_key_id?: string | null
          company_id?: string
          created_at?: string
          endpoint?: string
          id?: string
          ip_address?: string | null
          method?: string
          request_body?: Json | null
          response_body?: Json | null
          status_code?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "external_api_logs_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "external_api_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "external_api_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_reports: {
        Row: {
          admin_notes: string | null
          company_id: string | null
          created_at: string
          description: string
          id: string
          priority: string | null
          resolved_at: string | null
          status: string
          title: string
          type: string
          updated_at: string
          user_email: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          company_id?: string | null
          created_at?: string
          description: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string
          user_email?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          company_id?: string | null
          created_at?: string
          description?: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          user_email?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_reports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_forms: {
        Row: {
          answered: boolean
          connection_id: string | null
          created_at: string
          expires_at: string
          id: string
          initial_message: string | null
          phone: string
          questions: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          answered?: boolean
          connection_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          initial_message?: string | null
          phone: string
          questions?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          answered?: boolean
          connection_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          initial_message?: string | null
          phone?: string
          questions?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flow_forms_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_sessions: {
        Row: {
          company_id: string
          conversation_id: string
          created_at: string
          current_node_id: string
          error_count: number
          flow_id: string
          id: string
          status: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          company_id: string
          conversation_id: string
          created_at?: string
          current_node_id: string
          error_count?: number
          flow_id: string
          id?: string
          status?: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          company_id?: string
          conversation_id?: string
          created_at?: string
          current_node_id?: string
          error_count?: number
          flow_id?: string
          id?: string
          status?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      flows: {
        Row: {
          connection_id: string | null
          created_at: string | null
          description: string | null
          executions_today: number | null
          flow_json: Json | null
          id: string
          name: string
          status: string | null
          trigger: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          connection_id?: string | null
          created_at?: string | null
          description?: string | null
          executions_today?: number | null
          flow_json?: Json | null
          id?: string
          name: string
          status?: string | null
          trigger: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          connection_id?: string | null
          created_at?: string | null
          description?: string | null
          executions_today?: number | null
          flow_json?: Json | null
          id?: string
          name?: string
          status?: string | null
          trigger?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flows_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
        ]
      }
      form_responses: {
        Row: {
          collected_data: Json
          conversation_id: string | null
          created_at: string
          flow_id: string | null
          id: string
          name: string | null
          notes: string | null
          phone: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          collected_data?: Json
          conversation_id?: string | null
          created_at?: string
          flow_id?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          phone: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          collected_data?: Json
          conversation_id?: string | null
          created_at?: string
          flow_id?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          phone?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_responses_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_responses_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "flows"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_images: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          image_url: string
          metadata: Json | null
          mode: string
          model: string
          prompt: string
          source_image_url: string | null
          storage_path: string | null
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          image_url: string
          metadata?: Json | null
          mode?: string
          model?: string
          prompt: string
          source_image_url?: string | null
          storage_path?: string | null
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          image_url?: string
          metadata?: Json | null
          mode?: string
          model?: string
          prompt?: string
          source_image_url?: string | null
          storage_path?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_images_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      google_drive_tokens: {
        Row: {
          access_token: string
          created_at: string | null
          expires_at: string
          folder_id: string | null
          id: string
          refresh_token: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          expires_at: string
          folder_id?: string | null
          id?: string
          refresh_token: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          expires_at?: string
          folder_id?: string | null
          id?: string
          refresh_token?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      internal_chat_mentions: {
        Row: {
          created_at: string | null
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "internal_chat_mentions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "internal_chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_chat_messages: {
        Row: {
          content: string | null
          created_at: string | null
          file_name: string | null
          file_url: string | null
          id: string
          is_pinned: boolean | null
          reply_to: string | null
          room_id: string
          sender_id: string
          type: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_pinned?: boolean | null
          reply_to?: string | null
          room_id: string
          sender_id: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_pinned?: boolean | null
          reply_to?: string | null
          room_id?: string
          sender_id?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "internal_chat_messages_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "internal_chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internal_chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "internal_chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_chat_participants: {
        Row: {
          id: string
          joined_at: string | null
          role: string
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role?: string
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          role?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "internal_chat_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "internal_chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_chat_reactions: {
        Row: {
          created_at: string | null
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "internal_chat_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "internal_chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_chat_rooms: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          created_by: string
          id: string
          name: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          created_by: string
          id?: string
          name?: string | null
          type?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          created_by?: string
          id?: string
          name?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      internal_tasks: {
        Row: {
          assigned_to: string
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          message_id: string | null
          reminder_at: string | null
          room_id: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to: string
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          message_id?: string | null
          reminder_at?: string | null
          room_id?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          message_id?: string | null
          reminder_at?: string | null
          room_id?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "internal_tasks_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "internal_chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internal_tasks_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "internal_chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          avatar: string | null
          birth_date: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          origin: string
          phone: string
          status: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          origin: string
          phone: string
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          origin?: string
          phone?: string
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      leads_forms_responses: {
        Row: {
          address: string | null
          answers: Json
          connection_id: string | null
          created_at: string
          form_id: string
          id: string
          name: string | null
          phone: string
        }
        Insert: {
          address?: string | null
          answers?: Json
          connection_id?: string | null
          created_at?: string
          form_id: string
          id?: string
          name?: string | null
          phone: string
        }
        Update: {
          address?: string | null
          answers?: Json
          connection_id?: string | null
          created_at?: string
          form_id?: string
          id?: string
          name?: string | null
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_forms_responses_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_forms_responses_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "flow_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      mercado_pago_configs: {
        Row: {
          access_token: string
          apelido: string | null
          auto_send: boolean
          company_id: string
          confirmation_enabled: boolean | null
          confirmation_template: string | null
          created_at: string
          default_connection_id: string | null
          id: string
          ondemand_deadline_hours: number
          ondemand_interval_hours: number
          ondemand_max_reminders: number
          ondemand_max_valor: number | null
          ondemand_min_valor: number | null
          ondemand_reminders_enabled: boolean
          ondemand_template: string
          pix_template: string | null
          remind_after_due: boolean
          reminder_days_before: number
          reminder_interval_hours: number
          reminder_template: string | null
          reminder_templates: Json
          reminders_enabled: boolean
          updated_at: string
        }
        Insert: {
          access_token: string
          apelido?: string | null
          auto_send?: boolean
          company_id: string
          confirmation_enabled?: boolean | null
          confirmation_template?: string | null
          created_at?: string
          default_connection_id?: string | null
          id?: string
          ondemand_deadline_hours?: number
          ondemand_interval_hours?: number
          ondemand_max_reminders?: number
          ondemand_max_valor?: number | null
          ondemand_min_valor?: number | null
          ondemand_reminders_enabled?: boolean
          ondemand_template?: string
          pix_template?: string | null
          remind_after_due?: boolean
          reminder_days_before?: number
          reminder_interval_hours?: number
          reminder_template?: string | null
          reminder_templates?: Json
          reminders_enabled?: boolean
          updated_at?: string
        }
        Update: {
          access_token?: string
          apelido?: string | null
          auto_send?: boolean
          company_id?: string
          confirmation_enabled?: boolean | null
          confirmation_template?: string | null
          created_at?: string
          default_connection_id?: string | null
          id?: string
          ondemand_deadline_hours?: number
          ondemand_interval_hours?: number
          ondemand_max_reminders?: number
          ondemand_max_valor?: number | null
          ondemand_min_valor?: number | null
          ondemand_reminders_enabled?: boolean
          ondemand_template?: string
          pix_template?: string | null
          remind_after_due?: boolean
          reminder_days_before?: number
          reminder_interval_hours?: number
          reminder_template?: string | null
          reminder_templates?: Json
          reminders_enabled?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mercado_pago_configs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mercado_pago_configs_default_connection_id_fkey"
            columns: ["default_connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
        ]
      }
      message_templates: {
        Row: {
          category: string
          company_id: string | null
          content: string
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
          variables: string[] | null
        }
        Insert: {
          category?: string
          company_id?: string | null
          content: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
          variables?: string[] | null
        }
        Update: {
          category?: string
          company_id?: string | null
          content?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
          variables?: string[] | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          from_number: string | null
          id: string
          instance_id: string | null
          is_from_me: boolean | null
          raw_data: Json | null
          sender: string
          timestamp: string | null
          to_number: string | null
          type: string | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          from_number?: string | null
          id?: string
          instance_id?: string | null
          is_from_me?: boolean | null
          raw_data?: Json | null
          sender: string
          timestamp?: string | null
          to_number?: string | null
          type?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          from_number?: string | null
          id?: string
          instance_id?: string | null
          is_from_me?: boolean | null
          raw_data?: Json | null
          sender?: string
          timestamp?: string | null
          to_number?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      pix_reminder_history: {
        Row: {
          cliente_nome: string | null
          cobranca_id: string | null
          company_id: string | null
          connection_id: string | null
          created_at: string
          error_message: string | null
          id: string
          link_pagamento: string | null
          message_text: string
          pix_copia_cola: string | null
          source: string
          success: boolean
          telefone: string | null
          template: string
          valor: number | null
          vencimento: string | null
        }
        Insert: {
          cliente_nome?: string | null
          cobranca_id?: string | null
          company_id?: string | null
          connection_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          link_pagamento?: string | null
          message_text: string
          pix_copia_cola?: string | null
          source?: string
          success?: boolean
          telefone?: string | null
          template: string
          valor?: number | null
          vencimento?: string | null
        }
        Update: {
          cliente_nome?: string | null
          cobranca_id?: string | null
          company_id?: string | null
          connection_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          link_pagamento?: string | null
          message_text?: string
          pix_copia_cola?: string | null
          source?: string
          success?: boolean
          telefone?: string | null
          template?: string
          valor?: number | null
          vencimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pix_reminder_history_cobranca_id_fkey"
            columns: ["cobranca_id"]
            isOneToOne: false
            referencedRelation: "cobrancas"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_limits: {
        Row: {
          created_at: string
          is_active: boolean
          limits: Json
          name: string
          price_annual: number
          price_monthly: number
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          is_active?: boolean
          limits?: Json
          name: string
          price_annual?: number
          price_monthly?: number
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          is_active?: boolean
          limits?: Json
          name?: string
          price_annual?: number
          price_monthly?: number
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      platform_subscriptions: {
        Row: {
          amount: number
          billing: string
          company_id: string
          created_at: string
          current_period_end: string | null
          id: string
          last_payment_at: string | null
          mp_init_point: string | null
          mp_preapproval_id: string | null
          raw: Json | null
          status: string
          tier: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          billing: string
          company_id: string
          created_at?: string
          current_period_end?: string | null
          id?: string
          last_payment_at?: string | null
          mp_init_point?: string | null
          mp_preapproval_id?: string | null
          raw?: Json | null
          status?: string
          tier: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          billing?: string
          company_id?: string
          created_at?: string
          current_period_end?: string | null
          id?: string
          last_payment_at?: string | null
          mp_init_point?: string | null
          mp_preapproval_id?: string | null
          raw?: Json | null
          status?: string
          tier?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_id: string | null
          company_name: string | null
          created_at: string | null
          department_id: string | null
          full_name: string | null
          id: string
          is_company_admin: boolean | null
          is_online: boolean | null
          last_seen_at: string | null
          permissions: Json | null
          status: string | null
          updated_at: string | null
          username: string | null
          work_schedule: Json | null
        }
        Insert: {
          company_id?: string | null
          company_name?: string | null
          created_at?: string | null
          department_id?: string | null
          full_name?: string | null
          id: string
          is_company_admin?: boolean | null
          is_online?: boolean | null
          last_seen_at?: string | null
          permissions?: Json | null
          status?: string | null
          updated_at?: string | null
          username?: string | null
          work_schedule?: Json | null
        }
        Update: {
          company_id?: string | null
          company_name?: string | null
          created_at?: string | null
          department_id?: string | null
          full_name?: string | null
          id?: string
          is_company_admin?: boolean | null
          is_online?: boolean | null
          last_seen_at?: string | null
          permissions?: Json | null
          status?: string | null
          updated_at?: string | null
          username?: string | null
          work_schedule?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_settings: {
        Row: {
          auto_distribute: boolean
          company_id: string
          created_at: string
          id: string
          lock_conversation: boolean
          message_format: string
          sign_messages: boolean
          sla_minutes: number
          updated_at: string
        }
        Insert: {
          auto_distribute?: boolean
          company_id: string
          created_at?: string
          id?: string
          lock_conversation?: boolean
          message_format?: string
          sign_messages?: boolean
          sla_minutes?: number
          updated_at?: string
        }
        Update: {
          auto_distribute?: boolean
          company_id?: string
          created_at?: string
          id?: string
          lock_conversation?: boolean
          message_format?: string
          sign_messages?: boolean
          sla_minutes?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      satisfaction_responses: {
        Row: {
          contact_name: string | null
          contact_phone: string
          created_at: string | null
          feedback_text: string | null
          id: string
          responded_at: string | null
          response_score: number | null
          response_value: string
          survey_id: string | null
          user_id: string
        }
        Insert: {
          contact_name?: string | null
          contact_phone: string
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          responded_at?: string | null
          response_score?: number | null
          response_value: string
          survey_id?: string | null
          user_id: string
        }
        Update: {
          contact_name?: string | null
          contact_phone?: string
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          responded_at?: string | null
          response_score?: number | null
          response_value?: string
          survey_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "satisfaction_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "satisfaction_surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      satisfaction_surveys: {
        Row: {
          connection_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          message_content: string
          name: string
          options: Json
          survey_type: string
          total_responses: number | null
          total_sent: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          connection_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message_content: string
          name: string
          options?: Json
          survey_type?: string
          total_responses?: number | null
          total_sent?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          connection_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message_content?: string
          name?: string
          options?: Json
          survey_type?: string
          total_responses?: number | null
          total_sent?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "satisfaction_surveys_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          company_name: string | null
          created_at: string | null
          email: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
          website: string | null
          whatsapp_instance_id: string | null
          whatsapp_status: string | null
          whatsapp_token: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
          whatsapp_instance_id?: string | null
          whatsapp_status?: string | null
          whatsapp_token?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
          whatsapp_instance_id?: string | null
          whatsapp_status?: string | null
          whatsapp_token?: string | null
        }
        Relationships: []
      }
      smart_form_submissions: {
        Row: {
          answers: Json
          connection_id: string | null
          contacted_at: string | null
          conversation_id: string | null
          created_at: string
          department_id: string | null
          form_id: string | null
          id: string
          name: string | null
          notes: string | null
          phone: string
          status: string
          submitted_at: string | null
          unique_token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json
          connection_id?: string | null
          contacted_at?: string | null
          conversation_id?: string | null
          created_at?: string
          department_id?: string | null
          form_id?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          phone: string
          status?: string
          submitted_at?: string | null
          unique_token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          connection_id?: string | null
          contacted_at?: string | null
          conversation_id?: string | null
          created_at?: string
          department_id?: string | null
          form_id?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          phone?: string
          status?: string
          submitted_at?: string | null
          unique_token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "smart_form_submissions_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "smart_form_submissions_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "smart_form_submissions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "smart_form_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "smart_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_forms: {
        Row: {
          created_at: string
          department_id: string | null
          fields: Json
          id: string
          is_active: boolean | null
          name: string
          success_message: string | null
          updated_at: string
          user_id: string
          welcome_message: string | null
          whatsapp_confirmation: boolean | null
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          fields?: Json
          id?: string
          is_active?: boolean | null
          name: string
          success_message?: string | null
          updated_at?: string
          user_id: string
          welcome_message?: string | null
          whatsapp_confirmation?: boolean | null
        }
        Update: {
          created_at?: string
          department_id?: string | null
          fields?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          success_message?: string | null
          updated_at?: string
          user_id?: string
          welcome_message?: string | null
          whatsapp_confirmation?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "smart_forms_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          max_connections: number | null
          max_conversations_month: number | null
          max_flows: number | null
          max_users: number | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_connections?: number | null
          max_conversations_month?: number | null
          max_flows?: number | null
          max_users?: number | null
          name: string
          price?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_connections?: number | null
          max_conversations_month?: number | null
          max_flows?: number | null
          max_users?: number | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string | null
          company_id: string | null
          created_at: string
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          color?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          color?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      telegram_notification_configs: {
        Row: {
          company_id: string | null
          connection_id: string | null
          created_at: string
          filter_keywords: string[] | null
          filter_mode: string
          id: string
          is_active: boolean
          name: string
          notify_campaign_start: boolean
          notify_lead_response: boolean
          telegram_bot_token: string | null
          telegram_chat_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          connection_id?: string | null
          created_at?: string
          filter_keywords?: string[] | null
          filter_mode?: string
          id?: string
          is_active?: boolean
          name?: string
          notify_campaign_start?: boolean
          notify_lead_response?: boolean
          telegram_bot_token?: string | null
          telegram_chat_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          connection_id?: string | null
          created_at?: string
          filter_keywords?: string[] | null
          filter_mode?: string
          id?: string
          is_active?: boolean
          name?: string
          notify_campaign_start?: boolean
          notify_lead_response?: boolean
          telegram_bot_token?: string | null
          telegram_chat_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "telegram_notification_configs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "telegram_notification_configs_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
        ]
      }
      user_connections: {
        Row: {
          connection_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          connection_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          connection_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_connections_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          always_online: boolean
          auto_login_queue: boolean
          can_access_internal_chat: boolean
          can_access_wa_groups: boolean
          can_create_tasks_for_others: boolean
          can_export_chats: boolean
          can_manage_tasks: boolean
          can_open_new_chats: boolean
          can_read_chat_history: boolean
          can_supervise: boolean
          can_view_queue: boolean
          company_id: string | null
          created_at: string
          id: string
          last_assigned_at: string | null
          monthly_goal: number
          sales: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          always_online?: boolean
          auto_login_queue?: boolean
          can_access_internal_chat?: boolean
          can_access_wa_groups?: boolean
          can_create_tasks_for_others?: boolean
          can_export_chats?: boolean
          can_manage_tasks?: boolean
          can_open_new_chats?: boolean
          can_read_chat_history?: boolean
          can_supervise?: boolean
          can_view_queue?: boolean
          company_id?: string | null
          created_at?: string
          id?: string
          last_assigned_at?: string | null
          monthly_goal?: number
          sales?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          always_online?: boolean
          auto_login_queue?: boolean
          can_access_internal_chat?: boolean
          can_access_wa_groups?: boolean
          can_create_tasks_for_others?: boolean
          can_export_chats?: boolean
          can_manage_tasks?: boolean
          can_open_new_chats?: boolean
          can_read_chat_history?: boolean
          can_supervise?: boolean
          can_view_queue?: boolean
          company_id?: string | null
          created_at?: string
          id?: string
          last_assigned_at?: string | null
          monthly_goal?: number
          sales?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      uzapi_contract: {
        Row: {
          contract_end: string | null
          contract_start: string | null
          created_at: string | null
          id: string
          monthly_cost: number | null
          plan_name: string
          total_connections: number
          updated_at: string | null
        }
        Insert: {
          contract_end?: string | null
          contract_start?: string | null
          created_at?: string | null
          id?: string
          monthly_cost?: number | null
          plan_name?: string
          total_connections?: number
          updated_at?: string | null
        }
        Update: {
          contract_end?: string | null
          contract_start?: string | null
          created_at?: string | null
          id?: string
          monthly_cost?: number | null
          plan_name?: string
          total_connections?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      vendas: {
        Row: {
          cliente: string
          company_id: string | null
          created_at: string
          data: string
          id: string
          observacoes: string | null
          produto: string | null
          updated_at: string
          user_id: string | null
          valor: number
        }
        Insert: {
          cliente: string
          company_id?: string | null
          created_at?: string
          data?: string
          id?: string
          observacoes?: string | null
          produto?: string | null
          updated_at?: string
          user_id?: string | null
          valor?: number
        }
        Update: {
          cliente?: string
          company_id?: string | null
          created_at?: string
          data?: string
          id?: string
          observacoes?: string | null
          produto?: string | null
          updated_at?: string
          user_id?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "vendas_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_field_configs: {
        Row: {
          capture_button_clicked: boolean | null
          capture_campaign_name: boolean | null
          capture_contact_address: boolean | null
          capture_contact_name: boolean | null
          capture_contact_phone: boolean | null
          capture_list_selection: boolean | null
          capture_message_content: boolean | null
          capture_message_time: boolean | null
          capture_response_type: boolean | null
          connection_id: string | null
          created_at: string
          custom_fields: Json | null
          external_webhook_enabled: boolean | null
          external_webhook_headers: Json | null
          external_webhook_url: string | null
          filter_campaigns: Json | null
          filter_only_buttons: boolean | null
          filter_only_responses: boolean | null
          id: string
          is_active: boolean | null
          name: string
          telegram_chat_id: string | null
          telegram_enabled: boolean | null
          telegram_filter_keywords: string[] | null
          telegram_filter_mode: string | null
          telegram_send_to_channel: boolean | null
          telegram_send_to_group: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          capture_button_clicked?: boolean | null
          capture_campaign_name?: boolean | null
          capture_contact_address?: boolean | null
          capture_contact_name?: boolean | null
          capture_contact_phone?: boolean | null
          capture_list_selection?: boolean | null
          capture_message_content?: boolean | null
          capture_message_time?: boolean | null
          capture_response_type?: boolean | null
          connection_id?: string | null
          created_at?: string
          custom_fields?: Json | null
          external_webhook_enabled?: boolean | null
          external_webhook_headers?: Json | null
          external_webhook_url?: string | null
          filter_campaigns?: Json | null
          filter_only_buttons?: boolean | null
          filter_only_responses?: boolean | null
          id?: string
          is_active?: boolean | null
          name?: string
          telegram_chat_id?: string | null
          telegram_enabled?: boolean | null
          telegram_filter_keywords?: string[] | null
          telegram_filter_mode?: string | null
          telegram_send_to_channel?: boolean | null
          telegram_send_to_group?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          capture_button_clicked?: boolean | null
          capture_campaign_name?: boolean | null
          capture_contact_address?: boolean | null
          capture_contact_name?: boolean | null
          capture_contact_phone?: boolean | null
          capture_list_selection?: boolean | null
          capture_message_content?: boolean | null
          capture_message_time?: boolean | null
          capture_response_type?: boolean | null
          connection_id?: string | null
          created_at?: string
          custom_fields?: Json | null
          external_webhook_enabled?: boolean | null
          external_webhook_headers?: Json | null
          external_webhook_url?: string | null
          filter_campaigns?: Json | null
          filter_only_buttons?: boolean | null
          filter_only_responses?: boolean | null
          id?: string
          is_active?: boolean | null
          name?: string
          telegram_chat_id?: string | null
          telegram_enabled?: boolean | null
          telegram_filter_keywords?: string[] | null
          telegram_filter_mode?: string | null
          telegram_send_to_channel?: boolean | null
          telegram_send_to_group?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_field_configs_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_connections: {
        Row: {
          company_id: string
          created_at: string
          id: string
          last_error: string | null
          last_tested_at: string | null
          meta_access_token: string | null
          meta_business_id: string | null
          meta_connected_at: string | null
          meta_phone_number_id: string | null
          meta_verify_token: string | null
          meta_waba_id: string | null
          provider: string
          qr_api_token: string | null
          qr_api_url: string | null
          qr_instance_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          last_error?: string | null
          last_tested_at?: string | null
          meta_access_token?: string | null
          meta_business_id?: string | null
          meta_connected_at?: string | null
          meta_phone_number_id?: string | null
          meta_verify_token?: string | null
          meta_waba_id?: string | null
          provider: string
          qr_api_token?: string | null
          qr_api_url?: string | null
          qr_instance_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          last_error?: string | null
          last_tested_at?: string | null
          meta_access_token?: string | null
          meta_business_id?: string | null
          meta_connected_at?: string | null
          meta_phone_number_id?: string | null
          meta_verify_token?: string | null
          meta_waba_id?: string | null
          provider?: string
          qr_api_token?: string | null
          qr_api_url?: string | null
          qr_instance_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_connections_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          body: string | null
          company_id: string
          connection_id: string | null
          created_at: string
          direction: string
          from_number: string | null
          id: string
          message_type: string | null
          phone_number_id: string | null
          provider: string
          raw: Json | null
          status: string | null
          to_number: string | null
          wa_message_id: string | null
        }
        Insert: {
          body?: string | null
          company_id: string
          connection_id?: string | null
          created_at?: string
          direction: string
          from_number?: string | null
          id?: string
          message_type?: string | null
          phone_number_id?: string | null
          provider: string
          raw?: Json | null
          status?: string | null
          to_number?: string | null
          wa_message_id?: string | null
        }
        Update: {
          body?: string | null
          company_id?: string
          connection_id?: string | null
          created_at?: string
          direction?: string
          from_number?: string | null
          id?: string
          message_type?: string | null
          phone_number_id?: string | null
          provider?: string
          raw?: Json | null
          status?: string | null
          to_number?: string | null
          wa_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      white_label_partners: {
        Row: {
          accent_color: string | null
          background_color: string | null
          created_at: string | null
          created_by: string | null
          custom_domain: string | null
          google_client_id: string | null
          google_client_secret: string | null
          google_drive_connected: boolean | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          partner_password: string | null
          primary_color: string | null
          secondary_color: string | null
          slug: string
          supabase_anon_key: string | null
          supabase_service_role_key: string | null
          supabase_url: string | null
          uazapi_admin_token: string | null
          uazapi_base_url: string | null
          uazapi_environment: string | null
          updated_at: string | null
        }
        Insert: {
          accent_color?: string | null
          background_color?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_domain?: string | null
          google_client_id?: string | null
          google_client_secret?: string | null
          google_drive_connected?: boolean | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          partner_password?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          slug: string
          supabase_anon_key?: string | null
          supabase_service_role_key?: string | null
          supabase_url?: string | null
          uazapi_admin_token?: string | null
          uazapi_base_url?: string | null
          uazapi_environment?: string | null
          updated_at?: string | null
        }
        Update: {
          accent_color?: string | null
          background_color?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_domain?: string | null
          google_client_id?: string | null
          google_client_secret?: string | null
          google_drive_connected?: boolean | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          partner_password?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          slug?: string
          supabase_anon_key?: string | null
          supabase_service_role_key?: string | null
          supabase_url?: string | null
          uazapi_admin_token?: string | null
          uazapi_base_url?: string | null
          uazapi_environment?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_get_all_agents: {
        Args: never
        Returns: {
          avg_response_time: string
          company_name: string
          conversations_today: number
          created_at: string
          id: string
          model: string
          name: string
          platform: string
          satisfaction: string
          status: string
          user_id: string
        }[]
      }
      admin_get_all_backups: {
        Args: never
        Returns: {
          backup_month: string
          company_name: string
          created_at: string
          drive_file_id: string
          drive_file_url: string
          file_name: string
          id: string
          protocol_number: string
          user_id: string
        }[]
      }
      admin_get_all_connections: {
        Args: never
        Returns: {
          company_name: string
          created_at: string
          environment: string
          id: string
          name: string
          platform: string
          status: string
          user_id: string
        }[]
      }
      admin_get_storage_stats: {
        Args: never
        Returns: {
          active_agents: number
          connected_connections: number
          total_agents: number
          total_backups: number
          total_companies: number
          total_connections: number
        }[]
      }
      get_company_cycle_start: {
        Args: { _company_id: string }
        Returns: string
      }
      get_message_room: { Args: { _message_id: string }; Returns: string }
      get_plan_usage: { Args: { _company_id: string }; Returns: Json }
      get_user_company_id: { Args: { _user_id: string }; Returns: string }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_user: { Args: { check_user_id: string }; Returns: boolean }
      is_room_admin: {
        Args: { _room_id: string; _user_id: string }
        Returns: boolean
      }
      is_room_creator: {
        Args: { _room_id: string; _user_id: string }
        Returns: boolean
      }
      is_room_participant: {
        Args: { _room_id: string; _user_id: string }
        Returns: boolean
      }
      match_agent_knowledge: {
        Args: {
          match_count?: number
          min_similarity?: number
          p_agent_id: string
          query_embedding: string
        }
        Returns: {
          content: string
          id: string
          similarity: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "agent"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "agent"],
    },
  },
} as const
