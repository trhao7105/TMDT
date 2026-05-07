import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../../api/axios";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MessageSquare, Plus, Clock, CheckCircle, RefreshCcw, Send } from "lucide-react";
import { format } from "date-fns";

export function SupportPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", category: "general" });
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const userIdStr = localStorage.getItem("userId");
    if (userIdStr) setUserId(parseInt(userIdStr));

    fetchTickets();
  }, [navigate]);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/support/tickets");
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    }
  };

  const fetchTicketDetails = async (id: number) => {
    try {
      const res = await api.get(`/support/tickets/${id}`);
      setActiveTicket(res.data);
      setMessages(res.data.support_messages || []);
    } catch (err) {
      console.error("Failed to fetch ticket details", err);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject) return;
    try {
      const res = await api.post("/support/tickets", newTicket);
      setTickets([res.data, ...tickets]);
      setIsCreating(false);
      setNewTicket({ subject: "", category: "general" });
      fetchTicketDetails(res.data.ticket_id);
    } catch (err) {
      console.error("Failed to create ticket", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeTicket) return;
    try {
      const res = await api.post(`/support/tickets/${activeTicket.ticket_id}/messages`, {
        message_content: newMessage
      });
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <Badge className="bg-blue-500">Đang mở</Badge>;
      case 'in_progress': return <Badge className="bg-yellow-500">Đang xử lý</Badge>;
      case 'resolved': return <Badge className="bg-green-500">Đã giải quyết</Badge>;
      case 'closed': return <Badge className="bg-gray-500">Đã đóng</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col max-w-7xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Hỗ trợ khách hàng</h1>
            <p className="text-muted-foreground mt-2">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
          </div>
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus className="h-5 w-5" />
            Tạo yêu cầu mới
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
          {/* Ticket List */}
          <Card className="lg:col-span-1 flex flex-col h-[700px] overflow-hidden border-border/50 shadow-sm">
            <div className="p-4 border-b bg-muted/20">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Yêu cầu của bạn
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {tickets.length === 0 ? (
                <div className="text-center text-muted-foreground mt-10">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <p>Chưa có yêu cầu hỗ trợ nào</p>
                </div>
              ) : (
                tickets.map(ticket => (
                  <div 
                    key={ticket.ticket_id}
                    onClick={() => {
                      fetchTicketDetails(ticket.ticket_id);
                      setIsCreating(false);
                    }}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      activeTicket?.ticket_id === ticket.ticket_id 
                        ? "border-primary bg-primary/5 shadow-sm" 
                        : "border-border hover:border-primary/30 hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium truncate pr-2 text-foreground">{ticket.subject}</h3>
                      {getStatusBadge(ticket.ticket_status)}
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(ticket.created_at), 'dd/MM/yyyy HH:mm')}
                      </span>
                      <span className="capitalize">{ticket.category}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Ticket Content Area */}
          <Card className="lg:col-span-2 flex flex-col h-[700px] border-border/50 shadow-sm">
            {isCreating ? (
              <div className="p-8 h-full flex flex-col">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Tạo yêu cầu mới</h2>
                  <p className="text-muted-foreground">Vui lòng cung cấp chi tiết vấn đề bạn đang gặp phải.</p>
                </div>
                <form onSubmit={handleCreateTicket} className="space-y-6 flex-1">
                  <div>
                    <label className="block text-sm font-medium mb-2">Chủ đề</label>
                    <input 
                      type="text" 
                      className="w-full p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="VD: Không thể mở khóa kho"
                      value={newTicket.subject}
                      onChange={e => setNewTicket({...newTicket, subject: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Danh mục</label>
                    <select 
                      className="w-full p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      value={newTicket.category}
                      onChange={e => setNewTicket({...newTicket, category: e.target.value})}
                    >
                      <option value="general">Chung</option>
                      <option value="technical">Kỹ thuật</option>
                      <option value="billing">Thanh toán</option>
                      <option value="account">Tài khoản</option>
                    </select>
                  </div>
                  <div className="pt-4">
                    <Button type="submit" size="lg" className="w-full md:w-auto">
                      Gửi yêu cầu
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setIsCreating(false)} className="ml-2">
                      Hủy
                    </Button>
                  </div>
                </form>
              </div>
            ) : activeTicket ? (
              <div className="flex flex-col h-full">
                <div className="p-6 border-b bg-muted/10">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-foreground">{activeTicket.subject}</h2>
                    <Button variant="ghost" size="sm" onClick={() => fetchTicketDetails(activeTicket.ticket_id)}>
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Mã: #{activeTicket.ticket_id}</span>
                    <span>Tạo lúc: {format(new Date(activeTicket.created_at), 'dd/MM/yyyy HH:mm')}</span>
                    {getStatusBadge(activeTicket.ticket_status)}
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground mt-10">
                      Chưa có tin nhắn nào
                    </div>
                  ) : (
                    messages.map((msg: any) => {
                      const isMe = msg.sender_id === userId;
                      return (
                        <div key={msg.message_id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                            isMe ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-white border rounded-tl-none text-foreground'
                          }`}>
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.message_content}</p>
                            <span className={`text-[10px] mt-2 block ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                              {format(new Date(msg.created_at), 'HH:mm dd/MM')}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="p-4 border-t bg-white">
                  {activeTicket.ticket_status === 'closed' ? (
                    <div className="text-center p-3 text-muted-foreground bg-muted/30 rounded-lg">
                      Yêu cầu này đã đóng, không thể gửi thêm tin nhắn.
                    </div>
                  ) : (
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                      <input 
                        type="text" 
                        className="flex-1 p-3 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 px-5"
                        placeholder="Nhập tin nhắn..."
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                      />
                      <Button type="submit" size="icon" className="h-12 w-12 rounded-full shrink-0" disabled={!newMessage.trim()}>
                        <Send className="h-5 w-5" />
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <MessageSquare className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">Chọn một yêu cầu</h3>
                <p className="max-w-md">Chọn một yêu cầu hỗ trợ từ danh sách bên trái để xem chi tiết hoặc tạo một yêu cầu mới nếu bạn cần giúp đỡ.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
