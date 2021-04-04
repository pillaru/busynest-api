using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BusyNestApi.Web.Models
{
    public class CreateOrganizationModel
    {
        public OrgId Id { get; set; }
    }

    [JsonConverter(typeof(OrgIdJsonConverter))]
    public class OrgId
    {
        private readonly Guid _id;

        public static OrgId NewId() => new OrgId(Guid.NewGuid());

        private OrgId(Guid id) => _id = id;

        public class OrgIdJsonConverter : JsonConverter<OrgId>
        {
            public override OrgId Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
            {
                if (Guid.TryParse(reader.GetString(), out var guid))
                {
                    return new OrgId(guid);
                }
                throw new JsonException();
            }

            public override void Write(Utf8JsonWriter writer, OrgId value, JsonSerializerOptions options)
                => writer.WriteStringValue(value._id.ToString());
        }
    }
}
