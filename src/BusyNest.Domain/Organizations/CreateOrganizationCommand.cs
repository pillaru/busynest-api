using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using MediatR;

namespace BusyNest.Domain.Organizations
{
    public class CreateOrganizationCommand : IRequest<CreateOrganizationResponse>
    {
        public OrgId Id { get; set; }
        public OrgName Name { get; set; }
    }

    public class CreateOrganizationResponse
    {
        public OrgId Id { get; set; }
        public OrgName Name { get; set; }
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

    [JsonConverter(typeof(OrgNameJsonConverter))]
    public class OrgName
    {
        private readonly string name;

        // todo: database table has a length restriction of 120 characters for name
        OrgName(string name) => this.name = name;

        public override string ToString() => name;

        public override int GetHashCode() => name.GetHashCode();

        public class OrgNameJsonConverter : JsonConverter<OrgName>
        {
            public override OrgName Read(ref Utf8JsonReader reader,
                                         Type typeToConvert,
                                         JsonSerializerOptions options)
            {
                return new OrgName(reader.GetString());
            }

            public override void Write(Utf8JsonWriter writer,
                OrgName value,
                JsonSerializerOptions options)
            {
                writer.WriteStringValue(value.ToString());
            }
        }
    }
}
