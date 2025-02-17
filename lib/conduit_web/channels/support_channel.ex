defmodule ConduitWeb.SupportChannel do
  use ConduitWeb, :channel

  @impl true
  def join(topic, _payload, socket) do
    if authorized?(topic, socket) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("chat", payload, socket) do
    {:reply,
     {:ok,
      %{
        "message" =>
          "Thanks, I'd be happy to assist you with #{payload["message"]}. Please provide some more details for me."
      }}, socket}
  end

  # # It is also common to receive messages from the client and
  # # broadcast to everyone in the current topic (support:lobby).
  # @impl true
  # def handle_in("shout", payload, socket) do
  #   broadcast(socket, "shout", payload)
  #   {:noreply, socket}
  # end

  # Add authorization logic here as required.
  defp authorized?(topic, socket) do
    case {topic, socket.assigns.user_id} do
      {"support:" <> user_id, user_id} -> true
      _ -> false
    end
  end
end
